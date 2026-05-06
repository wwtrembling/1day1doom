import os
import json
import time
from PIL import Image as PILImage
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)


def parse_prompt_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("systemPromopt", ""), data.get("userPromopt", "")


def _retry_call(fn, label):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait = 30 * (attempt + 1)
                print(f"[Retry] {label}: {err[:80]}... waiting {wait}s ({attempt+1}/{max_retries})")
                time.sleep(wait)
            else:
                print(f"[Error] {label}: {e}")
                return None
    print(f"[Error] {label}: max retries exceeded")
    return None


def generate_evolution_tree(job):
    """
    Generate a 3-stage career evolution tree for one job entry.
    Input: job dict from JOB_CATALOG (has id, label_ko, label_en, description_en).
    Output: dict matching the schema in evolution_tree.json prompt.
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return None

    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(base_dir, "prompt", "evolution_tree.json")
    system_prompt, user_template = parse_prompt_file(prompt_path)

    full_prompt = (user_template
                   .replace("{{job_id}}", job["id"])
                   .replace("{{job_label_ko}}", job["label_ko"])
                   .replace("{{job_description}}", job["description_en"]))

    def _call():
        config = types.GenerateContentConfig(response_mime_type='application/json')
        if system_prompt:
            config.system_instruction = system_prompt
        response = client.models.generate_content(
            model='gemini-2.0-flash-lite-001',
            contents=full_prompt,
            config=config
        )
        return json.loads(response.text)

    return _retry_call(_call, f"evolution_tree({job['id']})")


def generate_image_prompt(job, stage, stage_tone, composition_directive, path="bloom"):
    """
    Generate the Imagen-ready English prompt for a single evolution stage.
    `path` is "bloom" or "doom"; year-0 callers may pass "bloom" since both paths
    share the same year-0 image.
    """
    if not client:
        return None

    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(base_dir, "prompt", "image_prompt.json")
    system_prompt, user_template = parse_prompt_file(prompt_path)

    en = stage.get("en", {})
    full_prompt = (user_template
                   .replace("{{job_label_en}}", job["label_en"])
                   .replace("{{path}}", path)
                   .replace("{{year}}", str(stage.get("year", 0)))
                   .replace("{{stage_title_en}}", en.get("title", ""))
                   .replace("{{stage_description_en}}", en.get("description", ""))
                   .replace("{{stage_skills_en}}", ", ".join(en.get("skills", []) or []))
                   .replace("{{character_seed}}", job["character_seed"])
                   .replace("{{stage_tone}}", stage_tone)
                   .replace("{{composition_directive}}", composition_directive))

    def _call():
        config = types.GenerateContentConfig()
        if system_prompt:
            config.system_instruction = system_prompt
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
            config=config
        )
        return response.text.strip()

    return _retry_call(_call, f"image_prompt({job['id']}/{path}/y{stage.get('year')})")


def generate_image_from_text(prompt, output_path, aspect_ratio="3:4"):
    """
    Generate one image with Imagen and save it as a 1024x1280 webp (3:4 ratio).
    """
    if not client:
        print("Error: GEMINI_API_KEY is missing.")
        return False

    print(f"[Image] Generating image -> {output_path}")

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_images(
                model='imagen-4.0-fast-generate-001',
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=aspect_ratio,
                ),
            )

            if not response.generated_images:
                print("[Image] No image returned.")
                return False

            image = response.generated_images[0]

            if hasattr(image, 'image') and hasattr(image.image, 'save'):
                image.image.save(output_path)
            elif hasattr(image, 'image_bytes'):
                with open(output_path, 'wb') as f:
                    f.write(image.image_bytes)
            else:
                print(f"[Image] Cannot save image. Attributes: {dir(image)}")
                return False

            try:
                with PILImage.open(output_path) as img:
                    target = (1024, 1365) if aspect_ratio == "3:4" else (1024, 1024)
                    img = img.resize(target, PILImage.LANCZOS)
                    img.save(output_path, 'WEBP', quality=85)
                size_kb = os.path.getsize(output_path) // 1024
                print(f"[Image] Saved {output_path} ({size_kb}KB)")
            except Exception as resize_err:
                print(f"[Image] Saved (resize skipped: {resize_err})")
            return True

        except Exception as e:
            err = str(e)
            if any(k in err for k in ["429", "Quota exceeded", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                wait = 30 * (attempt + 1)
                print(f"[Image] Retry in {wait}s ({attempt+1}/{max_retries}): {err[:80]}...")
                time.sleep(wait)
            else:
                print(f"[Image] Error: {e}")
                return False
    return False
