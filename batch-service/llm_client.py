import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Client
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

def generate_scenario(date_str):
    """
    Generates the daily scenario using Gemini via google-genai SDK.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    # Load prompt template
    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(base_dir, "prompt", "scenario.txt")
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_content = f.read()

    full_prompt = f"""
{prompt_content}

[Command]
Today's date is "{date_str}".
Please invent a **completely new, random, creative, and hilarious Doom Theme** for today.
Output ONLY the JSON object.
"""

    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Using generate_content from the new client
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite-001', 
                contents=full_prompt,
                config=types.GenerateContentConfig(response_mime_type='application/json')
            )
            
            text = response.text
            data = json.loads(text)
            return data
        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait_time = 30 * (attempt + 1)
                print(f"[Warning] Quota exceeded. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"Error generating scenario: {e}")
                return None
    
    print("[Error] Max retries exceeded for scenario generation.")
    return None

def generate_text(prompt):
    """
    Generates text using Gemini.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite-001', 
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait_time = 30 * (attempt + 1)
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
                     
                print(f"[Image] Saved to {output_path}")
                return True
            else:
                print("[Image] No image returned.")
                return False
                
        except Exception as e:
            if "429" in str(e) or "Quota exceeded" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait_time = 30 * (attempt + 1)
                print(f"[Image] Quota exceeded. Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"[Image] Error generating image: {e}")
                return False
    return False
