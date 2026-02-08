import sys
import os

# Add parent directory to path to allow imports from batch-service
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

import json
import datetime
import llm_client
from config import ARCHETYPES

import argparse

# Setup paths
OUTPUT_DIR = os.path.join(current_dir, "test_output")

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def run_step1():
    print("=== [Step 1] Generating Scenario ===")
    date_str = "TEST-001"
    
    scenario_data = llm_client.generate_scenario(date_str)
    
    if not scenario_data:
        print("[Error] Failed to generate scenario.")
        return
    
    theme_title = scenario_data['content']['en']['theme_title']
    print(f"-> Scenario Generated: {theme_title}")
    
    # Save step 1
    output_path = os.path.join(OUTPUT_DIR, "step1_scenario.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(scenario_data, f, indent=2, ensure_ascii=False)
    print(f"-> Saved to {output_path}")

def run_step2():
    print("=== [Step 2] Generating Prompt ===")
    
    # Load Scenario
    scenario_path = os.path.join(OUTPUT_DIR, "step1_scenario.json")
    if not os.path.exists(scenario_path):
        print(f"[Error] Scenario file not found: {scenario_path}. Run step 1 first.")
        return

    with open(scenario_path, "r", encoding="utf-8") as f:
        scenario_data = json.load(f)
        
    target_job = "office"
    print(f"\n[Step 2] Generating Image Prompt for '{target_job}'...")
    
    content_src = scenario_data['content'].get('en', scenario_data['content'].get('ko'))
    
    # Read Template
    with open(os.path.join(parent_dir, "prompt", "prompt_gen.txt"), "r", encoding="utf-8") as f:
        prompt_gen_template = f.read()
        
    full_prompt_gen = prompt_gen_template.replace("{{theme_title}}", content_src['theme_title']) \
                                         .replace("{{theme_desc}}", content_src['theme_desc']) \
                                         .replace("{{job}}", target_job)
                                         
    image_prompt_text = llm_client.generate_text(full_prompt_gen)
    
    if not image_prompt_text:
        print(f"[Error] Failed to generate prompt for {target_job}")
        return

    print(f"-> Prompt Generated (First 100 chars): {image_prompt_text[:100]}...")
    
    # Save step 2
    prompt_path = os.path.join(OUTPUT_DIR, f"step2_{target_job}_prompt.txt")
    with open(prompt_path, "w", encoding="utf-8") as f:
        f.write(image_prompt_text)
    print(f"-> Saved to {prompt_path}")

def run_step3():
    print("=== [Step 3] Generating Image ===")
    target_job = "office"
    
    # Load Prompt
    prompt_path = os.path.join(OUTPUT_DIR, f"step2_{target_job}_prompt.txt")
    if not os.path.exists(prompt_path):
        print(f"[Error] Prompt file not found: {prompt_path}. Run step 2 first.")
        return
        
    with open(prompt_path, "r", encoding="utf-8") as f:
        image_prompt_text = f.read()
        
    # Generate Image
    print(f"\n[Step 3] Generating Image for '{target_job}'...")
    image_path = os.path.join(OUTPUT_DIR, f"step3_{target_job}.webp")
    
    success = llm_client.generate_image_from_text(image_prompt_text, image_path)
    
    if success:
        print(f"-> Image Generated Successfully: {image_path}")
    else:
        print("[Error] Failed to generate image.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Integration Test for Image Generation")
    parser.add_argument("--step", type=int, choices=[1, 2, 3], help="Step to run (1: Scenario, 2: Prompt, 3: Image)")
    
    args = parser.parse_args()
    
    if args.step == 1:
        run_step1()
    elif args.step == 2:
        run_step2()
    elif args.step == 3:
        run_step3()
    else:
        # Run all
        run_step1()
        run_step2()
        run_step3()
