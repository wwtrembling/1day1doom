import os
import json
import time
from PIL import Image as PILImage
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Client
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

def parse_prompt_file(file_path):
    """
    Parses a JSON prompt file with 'systemPromopt' and 'userPromopt' keys.
    Returns (system_prompt, user_prompt_template).
    """
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    system_prompt = data.get("systemPromopt", "")
    user_prompt = data.get("userPromopt", "")
    
    return system_prompt, user_prompt

def generate_scenario(date_str, scenario_id="s1", previous_themes=None):
    """
    Generates the daily scenario using Gemini via google-genai SDK.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    # Load prompt template
    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(base_dir, "prompt", "scenario.json")
    
    system_prompt, user_template = parse_prompt_file(prompt_path)
    
    # Fill User Template
    full_user_prompt = user_template.replace("{{scenario_id}}", scenario_id)

    # 이전 소재 목록 주입
    if previous_themes:
        themes_text = "🚫 아래는 이미 사용한 소재입니다. 이 소재들과 동일하거나 유사한 주제는 절대 사용하지 마세요:\n"
        for i, title in enumerate(previous_themes, 1):
            themes_text += f"  {i}. {title}\n"
    else:
        themes_text = ""
    full_user_prompt = full_user_prompt.replace("{{previous_themes}}", themes_text)

    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Using generate_content from the new client
            config = types.GenerateContentConfig(response_mime_type='application/json')
            
            if system_prompt:
                config.system_instruction = system_prompt

            response = client.models.generate_content(
                model='gemini-2.0-flash-lite-001', 
                contents=full_user_prompt,
                config=config
            )
            
            text = response.text
            data = json.loads(text)
            return data
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait_time = 30 * (attempt + 1)
                print(f"[Warning] Retryable error. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"Error generating scenario: {e}")
                return None
    
    print("[Error] Max retries exceeded for scenario generation.")
    return None


def generate_job_data(theme_title, theme_desc, job):
    """
    Generates job-specific future scenarios (10y/20y/30y).
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(base_dir, "prompt", "job_scenario.json")
    
    system_prompt, user_template = parse_prompt_file(prompt_path)

    full_user_prompt = user_template.replace("{{theme_title}}", theme_title) \
                                 .replace("{{theme_desc}}", theme_desc) \
                                 .replace("{{job}}", job)

    max_retries = 3
    for attempt in range(max_retries):
        try:
            config = types.GenerateContentConfig(response_mime_type='application/json')
            
            if system_prompt:
                config.system_instruction = system_prompt

            response = client.models.generate_content(
                model='gemini-2.0-flash-lite-001', 
                contents=full_user_prompt,
                config=config
            )
            return json.loads(response.text)
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait_time = 30 * (attempt + 1)
                print(f"[Warning] Retryable error for {job}. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"Error generating job data for {job}: {e}")
                return None
    return None

def generate_text(prompt, system_instruction=None):
    """
    Generates text using Gemini.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    max_retries = 3
    for attempt in range(max_retries):
        try:
            config = types.GenerateContentConfig()
            if system_instruction:
                config.system_instruction = system_instruction
                
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite-001', 
                contents=prompt,
                config=config
            )
            return response.text.strip()
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait_time = 30 * (attempt + 1)
                print(f"[Warning] Retryable error. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"Error generating text: {e}")
                return None
    return None

def generate_image_from_text(prompt, output_path):
    """
    Generates an image using Imagen 3 model via google-genai SDK using a direct text prompt.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return False

    print(f"[Image] Generating image...")
    # print(f"[Image] Prompt: {prompt}") # Optional: Don't print full prompt to keep logs clean if long
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Using models.generate_images
            response = client.models.generate_images(
                model='imagen-4.0-fast-generate-001',
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="1:1"
                )
            )
            
            # Response handling
            if response.generated_images:
                image = response.generated_images[0]
                
                # Check for PIL Image attribute (common in wrappers)
                if hasattr(image, 'image') and hasattr(image.image, 'save'):
                    image.image.save(output_path)
                # Check for raw bytes (common in v1beta/v0)
                elif hasattr(image, 'image_bytes'):
                     with open(output_path, 'wb') as f:
                         f.write(image.image_bytes)
                else:
                     print(f"[Image] Error: Cannot save image. Attributes: {dir(image)}")
                     return False
                     
                # 리사이즈 + 압축 (웹 최적화)
                try:
                    with PILImage.open(output_path) as img:
                        img = img.resize((512, 512), PILImage.LANCZOS)
                        img.save(output_path, 'WEBP', quality=80)
                    size_kb = os.path.getsize(output_path) // 1024
                    print(f"[Image] Saved to {output_path} ({size_kb}KB)")
                except Exception as resize_err:
                    print(f"[Image] Saved (resize skipped: {resize_err})")
                return True
            else:
                print("[Image] No image returned.")
                return False
                
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait_time = 30 * (attempt + 1)
                print(f"[Image] Retryable error. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"[Image] Error generating image: {e}")
                return False
    return False
