import os
import json
import shutil
import datetime
import sys
from config import DATA_CONTENT, SEO_KEYWORDS, ARCHETYPES, GENDERS

# Project Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'web-client')
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'web-client')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')
BATCH_OUTPUT_ROOT = os.path.join(BASE_DIR, 'output')
RAW_ASSETS_PATH = os.path.join(BASE_DIR, 'raw_assets')
SITEMAP_PATH = os.path.join(WEB_CLIENT_PATH, 'sitemap.xml')

def generate_daily_data(target_date_str=None):
    if target_date_str:
        today = datetime.datetime.strptime(target_date_str, "%Y-%m-%d").date()
    else:
        today = datetime.date.today()
    
    date_str = today.strftime("%Y-%m-%d")
    
    # Define Day Output Directory
    day_output_dir = os.path.join(BATCH_OUTPUT_ROOT, date_str)
    if not os.path.exists(day_output_dir):
        os.makedirs(day_output_dir)
    
    # 1. Prepare JSON Data
    data = {
        "meta": {
            "date": date_str,
            "seo_keywords": SEO_KEYWORDS
        },
        "content": DATA_CONTENT,
        "archetypes": {}
    }
    
    # 2. Process Files (Images)
    # New Mapping: {gender}_{job}.webp inside the date folder
    
    for gender in GENDERS:
        for job in ARCHETYPES:
            gender_full = 'male' if gender == 'm' else 'female'
            key_name = f"{gender_full}_{job}"
            
            src_filename = f"zombie_{gender}_{job}.webp"
            dst_filename = f"{gender_full}_{job}.webp"
            
            src_path = os.path.join(RAW_ASSETS_PATH, src_filename)
            dst_path = os.path.join(day_output_dir, dst_filename)
            
            # Copy file to Batch Output
            if os.path.exists(src_path):
                shutil.copy2(src_path, dst_path)
                print(f"[Asset] Copied {src_filename} to {dst_path}")
            else:
                print(f"[Warning] Source asset not found: {src_path}")
            
            # Add to JSON (Relative path from the JSON location)
            data["archetypes"][key_name] = f"./{dst_filename}"

    # 3. Write JSON File (data.json)
    output_file = os.path.join(day_output_dir, "data.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[Data] Generated {output_file}")
    
    # 4. Sync to Web Client
    # Destination: web-client/public/data/ (Flat structure, no date folder)
    if os.path.exists(PUBLIC_DATA_ROOT):
        # Clean up existing data to avoid stale files
        for filename in os.listdir(PUBLIC_DATA_ROOT):
            file_path = os.path.join(PUBLIC_DATA_ROOT, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
    else:
        os.makedirs(PUBLIC_DATA_ROOT)

    # Copy all files from day_output_dir to PUBLIC_DATA_ROOT
    for item in os.listdir(day_output_dir):
        s = os.path.join(day_output_dir, item)
        d = os.path.join(PUBLIC_DATA_ROOT, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)
            
    print(f"[Sync] Copied flat content to {PUBLIC_DATA_ROOT}")

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
    generate_daily_data(target_date)
