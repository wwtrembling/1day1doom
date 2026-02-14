import os
import json
import shutil

# Config
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_CLIENT_PATH = os.path.join(BASE_DIR, 'web-client')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')

# Jobs List (from config.py or app.js)
JOBS = [
    "office", "service", "professional", "labor", "art",
    "student", "influencer", "rich", "gamer", "home"
]

def split_data_json(scenario_id):
    scenario_dir = os.path.join(PUBLIC_DATA_ROOT, scenario_id)
    data_json_path = os.path.join(scenario_dir, 'data.json')
    
    if not os.path.exists(data_json_path):
        print(f"[Skip] {scenario_id}: data.json not found")
        return

    print(f"[Processing] {scenario_id}...")
    
    with open(data_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    meta = data.get('meta', {})
    
    for job in JOBS:
        # Create job-specific data structure
        job_data = {
            "meta": meta,
            "content": {},
            "archetypes": {}
        }
        
        # Copy content relevant to job (or all content if it's generic)
        # The user requested: "Master Scenario -> Job Data" pipeline.
        # But for EXISTING data, we just copy the generic scenario content.
        # FUTURE data will have specific content per job? 
        # The user said: "{job}_data.json 에서 30년뒤 미래 상황의 미지 생성 프롬프트 생성"
        # This implies {job}_data.json will likely hold the SAME structure but maybe customized content?
        # For now, let's duplicate the content since the existing 10y/20y text uses ${job} placeholders.
        # So we KEEP the placeholders or REPLACE them?
        # User said: "직업에 대표상황을 적용하여... 미래 데이터 생성"
        # Since we are converting EXISTING data, let's keep it as is (with placeholders)
        # OR better yet, if we can, pre-fill? No, app.js replaces them dynamically.
        # So we just keep the content block.
        
        job_data['content'] = data.get('content', {})
        
        # Archetypes: Only keep the specific job image
        # existing data doesn't have job-specific prompts in the global map
        # key is "office", "gamer" etc.
        
        img_path = data.get('archetypes', {}).get(job)
        if img_path:
             job_data['archetypes'][job] = img_path
             
        # Save {job}_data.json
        output_path = os.path.join(scenario_dir, f'{job}_data.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(job_data, f, indent=2, ensure_ascii=False)
            
    print(f"[Done] {scenario_id}: Created {len(JOBS)} job files.")

def main():
    # Read scenarios.json
    scenarios_path = os.path.join(PUBLIC_DATA_ROOT, 'scenarios.json')
    with open(scenarios_path, 'r', encoding='utf-8') as f:
        scenarios = json.load(f)
        
    for sid in scenarios:
        split_data_json(sid)

if __name__ == "__main__":
    main()
