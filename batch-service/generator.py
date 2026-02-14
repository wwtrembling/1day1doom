import os
import json
import shutil
import datetime
import sys
import llm_client
from config import ARCHETYPES
import os
from dotenv import load_dotenv
import concurrent.futures

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")


# Project Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'web-client')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')
BATCH_OUTPUT_ROOT = os.path.join(BASE_DIR, 'output') # Staging Area

# Manifest is in PUBLIC to drive the app
SCENARIOS_MANIFEST_PATH = os.path.join(PUBLIC_DATA_ROOT, 'scenarios.json')

def get_next_scenario_id():
    if not os.path.exists(SCENARIOS_MANIFEST_PATH):
        return "s1"
    
    with open(SCENARIOS_MANIFEST_PATH, 'r', encoding='utf-8') as f:
        scenarios = json.load(f)
    
    if not scenarios:
        return "s1"
        
    # Find max 'sN'
    max_n = 0
    for s in scenarios:
        if s.startswith('s'):
            try:
                n = int(s[1:])
                if n > max_n:
                    max_n = n
            except:
                pass
    
    return f"s{max_n + 1}"

def update_manifest(new_id):
    scenarios = []
    if os.path.exists(SCENARIOS_MANIFEST_PATH):
        with open(SCENARIOS_MANIFEST_PATH, 'r', encoding='utf-8') as f:
            scenarios = json.load(f)
            
    if new_id not in scenarios:
        scenarios.append(new_id)
        
    with open(SCENARIOS_MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(scenarios, f, indent=4)
    print(f"[Manifest] Updated {SCENARIOS_MANIFEST_PATH} with {new_id}")

def deploy_scenario(scenario_id):
    """
    Moves generated assets from BATCH_OUTPUT_ROOT to PUBLIC_DATA_ROOT.
    Moes Images (*.webp) AND JSONs (*.json).
    Keeps Prompts (*.txt) in BATCH_OUTPUT_ROOT.
    """
    src_dir = os.path.join(BATCH_OUTPUT_ROOT, scenario_id)
    dst_dir = os.path.join(PUBLIC_DATA_ROOT, scenario_id)
    
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)
        
    print(f"[Deploy] Deploying {scenario_id} from {src_dir} to {dst_dir}...")
    
    files = os.listdir(src_dir)
    for file in files:
        src_file = os.path.join(src_dir, file)
        dst_file = os.path.join(dst_dir, file)
        
        if file.endswith(".webp"):
            # Move Images (User Request: "Move image files")
            shutil.move(src_file, dst_file)
            print(f"  [Moved] {file}")
        elif file.endswith(".json"):
            # Copy/Move JSONs (Required for App)
            # Using copy so we keep a record in output? Or move?
            # User said "Result files in output... then move images".
            # Implies others stay? But App needs JSON.
            # I will COPY JSONs so they exist in both (Record + App)
            shutil.copy2(src_file, dst_file)
            print(f"  [Copied] {file}")
        else:
            # Leave Prompts (.txt) etc.
            print(f"  [Skipped] {file}")

    print(f"[Deploy] Completed for {scenario_id}")

def generate_new_scenario():
    # 1. Determine ID
    scenario_id = get_next_scenario_id()
    
    # 2. Output Directory (Staging)
    output_dir = os.path.join(BATCH_OUTPUT_ROOT, scenario_id)
    
    if os.path.exists(output_dir):
        print(f"[Warning] {output_dir} already exists. Overwriting...")
    else:
        os.makedirs(output_dir)
        
    print(f"[Generator] Starting generation for {scenario_id} in {output_dir}...")
    today_str = datetime.date.today().isoformat()
    
    # 3. Generate Master Scenario
    print("[Generator] Generating Master Scenario...")
    master_data = llm_client.generate_scenario(today_str)
    
    if not master_data:
        print("[Error] Failed to generate master scenario.")
        return

    master_content_ko = master_data.get('content', {}).get('ko', {})
    if not master_content_ko:
        master_content_ko = master_data
        
    theme_title = master_content_ko.get('theme_title', "Unknown Theme")
    theme_desc = master_content_ko.get('theme_desc', "No description.")
    
    print(f"[Generator] Theme: {theme_title}")

    # 4. Save Master Scenario JSON
    scenario_json_path = os.path.join(output_dir, "scenario.json")
    scenario_data = {
        "meta": {
             "date": today_str,
             "scenario_id": scenario_id
        },
        "content": master_data.get('content', master_data)
    }
    with open(scenario_json_path, 'w', encoding='utf-8') as f:
        json.dump(scenario_data, f, indent=2, ensure_ascii=False)
    print(f"[Generator] Saved {scenario_json_path}")

    # 5. Generate Job Data (Parallel)
    tasks = []
    
    prompt_gen_path = os.path.join(BASE_DIR, "prompt", "prompt_gen.json")
    system_prompt_gen, user_template_gen = llm_client.parse_prompt_file(prompt_gen_path)

    def process_job(job_entry):
        job_id, job_desc = job_entry
        print(f"[Job: {job_id}] Generating future scenarios...")
        
        # 5.1 Generate Future Scenarios
        # Pass the full description to the LLM for better context
        job_context = f"{job_desc}" 
        job_scenarios = llm_client.generate_job_data(theme_title, theme_desc, job_context)
        
        if not job_scenarios:
            print(f"[Job: {job_id}] Failed to generate scenarios.")
            return False

        # 5.2 Construct Job Data Structure
        job_data = {
            "meta": {
                "date": today_str,
                "scenario_id": scenario_id
            },
            "content": {
                "ko": {
                    "theme_title": theme_title,
                    "theme_desc": theme_desc,
                    "scenarios": job_scenarios 
                },
                "en": {
                    "theme_title": theme_title,
                    "theme_desc": theme_desc,
                    "scenarios": job_scenarios 
                }
            },
            "archetypes": {} 
        }

        # 5.3 Generate Image Prompt
        scenario_30y = job_scenarios.get("30y", "")
        context_desc = f"{theme_desc}\n\nSituation (30 Years Later): {scenario_30y}"
        
        full_prompt_gen = user_template_gen.replace("{{theme_title}}", theme_title) \
                                             .replace("{{theme_desc}}", context_desc) \
                                             .replace("{{job}}", job_context)
                                             
        print(f"[Job: {job_id}] Generating image prompt...")
        image_prompt_text = llm_client.generate_text(full_prompt_gen, system_instruction=system_prompt_gen)
        
        if not image_prompt_text:
            image_prompt_text = f"Dystopian {job_id} {theme_title}"

        with open(os.path.join(output_dir, f"{job_id}_prompt.txt"), "w", encoding="utf-8") as f:
            f.write(image_prompt_text)

        # 5.4 Generate Image
        img_filename = f"{job_id}.webp"
        img_path = os.path.join(output_dir, img_filename)
        
        print(f"[Job: {job_id}] Generating image...")
        success = llm_client.generate_image_from_text(image_prompt_text, img_path)
        
        if success:
            job_data["archetypes"][job_id] = f"./{img_filename}"
        else:
             print(f"[Job: {job_id}] Image generation failed.")
        
        # 5.5 Save Job Data JSON
        json_filename = f"{job_id}_data.json"
        with open(os.path.join(output_dir, json_filename), "w", encoding="utf-8") as f:
            json.dump(job_data, f, indent=2, ensure_ascii=False)
            
        return True

    # Run in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        # ARCHETYPES is now a dict, so .items() gives (key, value) tuples
        futures = {executor.submit(process_job, item): item[0] for item in ARCHETYPES.items()}
        for future in concurrent.futures.as_completed(futures):
            job_id = futures[future]
            try:
                future.result()
            except Exception as e:
                print(f"[Error] Job {job_id} failed: {e}")

    # 6. Deploy Assets
    deploy_scenario(scenario_id)

    # 7. Update Manifest
    update_manifest(scenario_id)
    print(f"[Success] Generated and Deployed {scenario_id}")

if __name__ == "__main__":
    generate_new_scenario()
