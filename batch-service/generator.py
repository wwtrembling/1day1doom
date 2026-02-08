import os
import json
import shutil
import datetime
import sys
import llm_client
from config import DATA_CONTENT, SEO_KEYWORDS, ARCHETYPES
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")


# Project Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'web-client')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')
BATCH_OUTPUT_ROOT = PUBLIC_DATA_ROOT # Write directly to public/data as requested
RAW_ASSETS_PATH = os.path.join(BASE_DIR, 'raw_assets')
SITEMAP_PATH = os.path.join(WEB_CLIENT_PATH, 'sitemap.xml')

def generate_weekly_data(target_date_str=None):
    if target_date_str:
        today = datetime.datetime.strptime(target_date_str, "%Y-%m-%d").date()
    else:
        today = datetime.date.today()
    
    
    
    # Calculate ISO Week
    current_date = today
    
    while True:
        iso_year, iso_week, _ = current_date.isocalendar()
        date_str = f"{iso_year}-W{iso_week:02d}"
        day_output_dir = os.path.join(BATCH_OUTPUT_ROOT, date_str)
        
        if not os.path.exists(day_output_dir):
            break
            
        print(f"[Generator] {date_str} already exists. Skipping to next week...")
        current_date = current_date + datetime.timedelta(weeks=1)

    print(f"[Generator] Target Date: {today}, Valid Week: {date_str}")
    
    os.makedirs(day_output_dir)
    
    # 1. Generate JSON Data via LLM
    print("[Generator] Requesting Scenario from Gemini...")
    llm_data = llm_client.generate_scenario(date_str)
    
    if not llm_data:
        print("[Error] Failed to generate scenario data. Aborting.")
        return

    # Ensure meta date matches the folder date string
    llm_data['meta']['date'] = date_str
    
    # 2. Generate Images via LLM (Parallel)
    # We need to construct tasks for each gender/job
    # Read prompt template
    with open(os.path.join(BASE_DIR, "prompt", "image.txt"), "r", encoding="utf-8") as f:
        image_prompt_template = f.read()
    
    # Prepare Archetypes list for processing
    tasks = []
    # Initialize archetypes dict in data
    llm_data["archetypes"] = {}

    for job in ARCHETYPES:
        # 2.1 Generate Image Prompt
        print(f"[Generator] Generating prompt for {job}...")
        
        # English content for prompt generation
        content_src = llm_data['content'].get('en', llm_data['content'].get('ko'))
        
        prompt_context = {
            "theme_title": content_src['theme_title'],
            "theme_desc": content_src['theme_desc'],
            "job": job
        }
        
        # We need a new method in llm_client or reuse generate_content with a different template
        # Let's read the prompt_gen template
        with open(os.path.join(BASE_DIR, "prompt", "prompt_gen.txt"), "r", encoding="utf-8") as f:
            prompt_gen_template = f.read()

        # Construct the full prompt for the LLM to write the image description
        full_prompt_gen = prompt_gen_template.replace("{{theme_title}}", prompt_context["theme_title"]) \
                                             .replace("{{theme_desc}}", prompt_context["theme_desc"]) \
                                             .replace("{{job}}", job)
        
        # Call LLM to get the image description
        image_prompt_text = llm_client.generate_text(full_prompt_gen)
        
        if not image_prompt_text:
            print(f"[Warning] Failed to generate prompt for {job}. Using fallback.")
            image_prompt_text = f"Funny dystopian {job} surviving {prompt_context['theme_title']}"
            
        # Save the generated prompt
        prompt_filename = f"{job}_prompt.txt"
        with open(os.path.join(day_output_dir, prompt_filename), "w", encoding="utf-8") as f:
            f.write(image_prompt_text)
            
        # 2.2 Generate Image
        dst_filename = f"{job}.webp"
        dst_path = os.path.join(day_output_dir, dst_filename)
        
        # Add to data json
        llm_data["archetypes"][job] = f"./{dst_filename}"
        
        # Add to task list (We pass the READY-MADE prompt, not a template)
        # We need to adjust generate_image signature or pass it as "context" that is already the prompt
        tasks.append((image_prompt_text, dst_path))

    print(f"[Generator] Starting {len(tasks)} image generation tasks in parallel...")
    
    import concurrent.futures
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        # Updated signature usage: generate_image_from_text(prompt, output_path)
        futures = {executor.submit(llm_client.generate_image_from_text, t[0], t[1]): t for t in tasks}
        
        for future in concurrent.futures.as_completed(futures):
            task_info = futures[future]
            #(prompt, path)
            job_name = os.path.basename(task_info[1]).replace(".webp", "")
            try:
                success = future.result()
                if success:
                    print(f"[Generator] Image task finished: {job_name}")
                else:
                    print(f"[Warning] Image task failed: {job_name}")
            except Exception as exc:
                print(f"[Error] Image task generated exception: {exc}")

    # 3. Write JSON File (data.json)
    output_file = os.path.join(day_output_dir, "data.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(llm_data, f, indent=2, ensure_ascii=False)
    print(f"[Data] Generated {output_file}")
    
    # 4. Update latest.js
    # We are writing directly to PUBLIC_DATA_ROOT, so we just need to update the pointer
    
    if not os.path.exists(PUBLIC_DATA_ROOT):
        os.makedirs(PUBLIC_DATA_ROOT)

    latest_js_path = os.path.join(PUBLIC_DATA_ROOT, "latest.js")
    with open(latest_js_path, 'w', encoding='utf-8') as f:
        f.write(f'var LATEST_DATA_DATE = "{date_str}";')
    print(f"[Sync] Updated {latest_js_path}")

    # 5. Update Sitemap
    update_sitemap(date_str)

def update_sitemap(date_str):
    # Simple XML append
    domain = "https://example.com" # TODO: Replace with actual domain if known, else usage placeholder
    url_entry = f"  <url>\n    <loc>{domain}/?date={date_str}</loc>\n    <lastmod>{date_str}</lastmod>\n  </url>"
    
    header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    footer = '</urlset>'
    
    content = ""
    existing_urls = []
    
    if os.path.exists(SITEMAP_PATH):
        try:
            with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
                # Very basic parsing to avoid duplicates
                if f"/?date={date_str}</loc>" in content:
                    print("[Sitemap] Entry already exists.")
                    return
                # Remove footer to append
                content = content.replace(footer, "")
        except Exception as e:
            print(f"[Sitemap] Error reading existing sitemap: {e}")
            content = header + "\n"
    else:
        content = header + "\n"
    
    # Append
    if not content.strip().endswith('\n'):
        content += "\n"
        
    content += url_entry + "\n" + footer
    
    with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[Sitemap] Updated with {date_str}")

if __name__ == "__main__":
    target_date = sys.argv[1] if len(sys.argv) > 1 else None
    generate_weekly_data(target_date)
