import os
import json
import re
import shutil
import datetime
import sys
import llm_client
from config import ARCHETYPES
from dotenv import load_dotenv
import concurrent.futures

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")


# Project Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'docs')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')
BATCH_OUTPUT_ROOT = os.path.join(BASE_DIR, 'output') # Staging Area

# Manifest is in PUBLIC to drive the app
SCENARIOS_MANIFEST_PATH = os.path.join(PUBLIC_DATA_ROOT, 'scenarios.json')

def get_next_scenario_id():
    """batch-service/output에서 기존 sN 폴더를 스캔하여 다음 ID를 결정합니다."""
    max_n = 0
    for root_dir in [BATCH_OUTPUT_ROOT, PUBLIC_DATA_ROOT]:
        if os.path.exists(root_dir):
            for name in os.listdir(root_dir):
                if os.path.isdir(os.path.join(root_dir, name)) and name.startswith('s'):
                    try:
                        n = int(name[1:])
                        if n > max_n:
                            max_n = n
                    except ValueError:
                        pass
    
    return f"s{max_n + 1}"

def update_manifest(new_id):
    """실제 존재하는 시나리오 폴더를 스캔하여 매니페스트를 생성합니다."""
    scenarios = []
    if os.path.exists(PUBLIC_DATA_ROOT):
        for name in os.listdir(PUBLIC_DATA_ROOT):
            dir_path = os.path.join(PUBLIC_DATA_ROOT, name)
            if os.path.isdir(dir_path) and name.startswith('s'):
                try:
                    int(name[1:])  # sN 형식인지 확인
                    scenarios.append(name)
                except ValueError:
                    pass
    
    # sN 번호 기준 정렬
    scenarios.sort(key=lambda x: int(x[1:]))
    
    with open(SCENARIOS_MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(scenarios, f, indent=4)
    print(f"[Manifest] Updated {SCENARIOS_MANIFEST_PATH}: {scenarios}")

def deploy_scenario(scenario_id):
    """
    Moves generated images from BATCH_OUTPUT_ROOT to PUBLIC_DATA_ROOT.
    Only images (*.webp) are moved. Other files stay in BATCH_OUTPUT_ROOT.
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
        shutil.move(src_file, dst_file)
        print(f"  [Moved] {file}")

    print(f"[Deploy] Completed for {scenario_id}")

    # Clean up: remove the source directory after deployment
    if os.path.exists(src_dir):
        shutil.rmtree(src_dir)
        print(f"[Deploy] Cleaned up {src_dir}")

    # Remove output root if empty
    if os.path.exists(BATCH_OUTPUT_ROOT) and not os.listdir(BATCH_OUTPUT_ROOT):
        os.rmdir(BATCH_OUTPUT_ROOT)
        print(f"[Deploy] Removed empty output directory {BATCH_OUTPUT_ROOT}")

def sanitize_image_prompt(prompt):
    """
    LLM이 생성한 이미지 프롬프트에서 텍스트/대사 요소를 제거하고,
    no-text 접미사를 추가합니다.
    """
    # 1. 따옴표 안의 대사/텍스트 제거 ("...", '...')
    prompt = re.sub(r'"[^"]{3,}"', '', prompt)
    prompt = re.sub(r"'[^']{3,}'", '', prompt)
    
    # 2. "saying ...", "reading ...", "labeled ...", "titled ..." 패턴 제거
    prompt = re.sub(r'\b(saying|reading|labeled|titled|captioned|writing|displaying)\s+\S+(\s+\S+){0,5}', '', prompt, flags=re.IGNORECASE)
    
    # 3. 마크다운 아티팩트 제거
    prompt = prompt.replace('```', '').replace('**', '')
    
    # 4. "Here's" 등 설명 접두어 제거
    prompt = re.sub(r"^(Here'?s?\s+(a|an|the|my|your)\s+.*?:\s*\n?)", '', prompt, flags=re.IGNORECASE)
    
    # 5. 연속 공백 정리
    prompt = re.sub(r'\s+', ' ', prompt).strip()
    
    # 6. no-text 접미사 추가
    no_text_suffix = ". Absolutely no text, no words, no letters, no numbers, no signs anywhere in the image."
    if "no text" not in prompt.lower():
        prompt += no_text_suffix
    
    return prompt

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
    master_data = llm_client.generate_scenario(today_str, scenario_id)
    
    if not master_data:
        print("[Error] Failed to generate master scenario.")
        return

    # LLM returns {ko: {theme_title, theme_desc}, en: {theme_title, theme_desc}}
    # LLM이 리스트로 반환하는 경우 방어 처리
    if isinstance(master_data, list):
        master_data = master_data[0] if master_data else {}
    
    ko_theme = master_data.get('ko', master_data)
    en_theme = master_data.get('en', master_data)
    
    theme_title_ko = ko_theme.get('theme_title', "Unknown Theme")
    theme_desc_ko = ko_theme.get('theme_desc', "No description.")
    theme_title_en = en_theme.get('theme_title', theme_title_ko)
    theme_desc_en = en_theme.get('theme_desc', theme_desc_ko)
    
    print(f"[Generator] Theme: {theme_title_ko}")

    # 4. Save Master Scenario JSON
    scenario_json_path = os.path.join(output_dir, "scenario.json")
    scenario_data = {
        "meta": {
             "date": today_str,
             "scenario_id": scenario_id
        },
        "content": master_data
    }
    with open(scenario_json_path, 'w', encoding='utf-8') as f:
        json.dump(scenario_data, f, indent=2, ensure_ascii=False)
    print(f"[Generator] Saved {scenario_json_path}")

    # 5. Generate Job Data (Parallel)
    tasks = []
    
    prompt_gen_path = os.path.join(BASE_DIR, "prompt", "image_prompt.json")
    system_prompt_gen, user_template_gen = llm_client.parse_prompt_file(prompt_gen_path)

    def process_job(job_entry):
        job_id, job_desc = job_entry
        print(f"[Job: {job_id}] Generating future scenarios...")
        
        # 5.1 Generate Future Scenarios
        # Pass the full description to the LLM for better context
        job_context = f"{job_desc}" 
        job_scenarios = llm_client.generate_job_data(theme_title_ko, theme_desc_ko, job_context)
        
        if not job_scenarios:
            print(f"[Job: {job_id}] Failed to generate scenarios.")
            return False

        # 5.2 Construct Job Data Structure
        # LLM returns {ko: {10y, 20y, 30y}, en: {10y, 20y, 30y}}
        ko_scenarios = job_scenarios.get('ko', job_scenarios)
        en_scenarios = job_scenarios.get('en', job_scenarios)
        
        job_data = {
            "meta": {
                "date": today_str,
                "scenario_id": scenario_id
            },
            "content": {
                "ko": {
                    "theme_title": theme_title_ko,
                    "theme_desc": theme_desc_ko,
                    "scenarios": ko_scenarios
                },
                "en": {
                    "theme_title": theme_title_en,
                    "theme_desc": theme_desc_en,
                    "scenarios": en_scenarios
                }
            },
            "archetypes": {} 
        }

        # 5.3 Generate Image Prompt
        scenario_30y = en_scenarios.get("30y", "")
        
        full_prompt_gen = user_template_gen.replace("{{theme_title}}", theme_title_en) \
                                             .replace("{{theme_desc}}", theme_desc_en) \
                                             .replace("{{scenario_30y}}", scenario_30y) \
                                             .replace("{{job}}", job_context)
                                             
        print(f"[Job: {job_id}] Generating image prompt...")
        image_prompt_text = llm_client.generate_text(full_prompt_gen, system_instruction=system_prompt_gen)
        
        if not image_prompt_text:
            image_prompt_text = f"Pixar-style 3D render, chibi {job_id} character in a colorful apocalyptic scene"

        # 프롬프트 후처리: 텍스트/대사 제거 + no-text 접미사 추가
        image_prompt_text = sanitize_image_prompt(image_prompt_text)

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
