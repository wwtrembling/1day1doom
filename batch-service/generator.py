"""
Career Evolution Tree generator.

For each job in JOB_CATALOG:
  1. Ask Gemini for a 3-stage evolution tree (year 0 / 10 / 30) in ko + en.
  2. For each stage, ask Gemini to write an Imagen-ready prompt.
  3. Call Imagen to render the stage illustration.
  4. Write evolution.json + stage_{0,10,30}.webp into docs/public/data/jobs/{job_id}/.
  5. Refresh docs/public/data/jobs.json manifest.

Usage:
  python generator.py                    # generate every job in JOB_CATALOG
  python generator.py --job teacher      # one job only
  python generator.py --list             # list all job ids
"""
import os
import re
import sys
import json
import argparse
import datetime
import concurrent.futures

from dotenv import load_dotenv

import llm_client
from config import JOB_CATALOG, STAGE_TONES, find_job_by_id

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("[Warn] GEMINI_API_KEY not found. Generation calls will fail; "
          "use --dry-run to preview prompts only.")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
WEB_CLIENT_PATH = os.path.join(PROJECT_ROOT, 'docs')
PUBLIC_DATA_ROOT = os.path.join(WEB_CLIENT_PATH, 'public', 'data')
JOBS_DIR = os.path.join(PUBLIC_DATA_ROOT, 'jobs')
JOBS_MANIFEST_PATH = os.path.join(PUBLIC_DATA_ROOT, 'jobs.json')


def sanitize_image_prompt(prompt):
    """Strip any text/dialogue artifacts from the LLM-written image prompt."""
    if not prompt:
        return prompt
    prompt = re.sub(r'"[^"]{3,}"', '', prompt)
    prompt = re.sub(r"'[^']{3,}'", '', prompt)
    prompt = re.sub(
        r'\b(saying|reading|labeled|titled|captioned|writing|displaying)\s+\S+(\s+\S+){0,5}',
        '', prompt, flags=re.IGNORECASE)
    prompt = prompt.replace('```', '').replace('**', '')
    prompt = re.sub(r"^(Here'?s?\s+(a|an|the|my|your)\s+.*?:\s*\n?)", '',
                    prompt, flags=re.IGNORECASE)
    prompt = re.sub(r'\s+', ' ', prompt).strip()
    if "no text" not in prompt.lower():
        prompt += (". Absolutely no text, no words, no letters, no numbers, "
                   "no signs, no logos anywhere in the image.")
    return prompt


def generate_one_job(job, dry_run=False):
    """Generate full evolution tree (data + 3 images) for a single job."""
    job_id = job["id"]
    out_dir = os.path.join(JOBS_DIR, job_id)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n[Job: {job_id}] Generating evolution tree...")

    if dry_run:
        print(f"  (dry-run) would generate evolution.json + 3 webps under {out_dir}")
        return True

    tree = llm_client.generate_evolution_tree(job)
    if not tree:
        print(f"[Job: {job_id}] FAILED to get evolution tree from LLM.")
        return False

    tree["job_id"] = job_id
    tree["label_ko"] = job["label_ko"]
    tree["label_en"] = job["label_en"]
    tree["aliases_ko"] = job.get("aliases_ko", [])
    tree["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"

    stages = tree.get("stages", [])
    if len(stages) != 3:
        print(f"[Job: {job_id}] WARNING: expected 3 stages, got {len(stages)}.")

    composition = job.get("composition", {})

    def render_stage(stage):
        year = stage.get("year", 0)
        comp = composition.get(f"year_{year}", "")
        tone = STAGE_TONES.get(year, "")
        prompt = llm_client.generate_image_prompt(job, stage, tone, comp)
        if not prompt:
            prompt = (f"Pixar-style 3D render, {job['character_seed']}, "
                      f"as {stage.get('en', {}).get('title', job['label_en'])}, "
                      f"warm cinematic lighting")
        prompt = sanitize_image_prompt(prompt)
        with open(os.path.join(out_dir, f"stage_{year}_prompt.txt"), "w",
                  encoding="utf-8") as f:
            f.write(prompt)
        img_path = os.path.join(out_dir, f"stage_{year}.webp")
        ok = llm_client.generate_image_from_text(prompt, img_path,
                                                 aspect_ratio="3:4")
        stage["image"] = f"stage_{year}.webp" if ok else None
        return ok

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
        list(ex.map(render_stage, stages))

    out_path = os.path.join(out_dir, "evolution.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(tree, f, indent=2, ensure_ascii=False)
    print(f"[Job: {job_id}] Wrote {out_path}")
    return True


def update_manifest():
    """Scan jobs/ dir and rebuild jobs.json from JOB_CATALOG (filtered)."""
    os.makedirs(PUBLIC_DATA_ROOT, exist_ok=True)
    available = set()
    if os.path.isdir(JOBS_DIR):
        for name in os.listdir(JOBS_DIR):
            ev_path = os.path.join(JOBS_DIR, name, "evolution.json")
            if os.path.isfile(ev_path):
                available.add(name)

    jobs = []
    for j in JOB_CATALOG:
        if j["id"] in available:
            jobs.append({
                "id": j["id"],
                "label_ko": j["label_ko"],
                "label_en": j["label_en"],
                "aliases_ko": j.get("aliases_ko", []),
            })

    manifest = {
        "version": 1,
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "jobs": jobs,
    }
    with open(JOBS_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"[Manifest] Wrote {JOBS_MANIFEST_PATH} ({len(jobs)} jobs)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--job", help="generate a single job by id (see --list)")
    parser.add_argument("--list", action="store_true", help="list all job ids and exit")
    parser.add_argument("--dry-run", action="store_true",
                        help="don't call any API, just verify config")
    parser.add_argument("--skip-existing", action="store_true",
                        help="skip jobs that already have evolution.json")
    args = parser.parse_args()

    if args.list:
        for j in JOB_CATALOG:
            print(f"  {j['id']:24s} {j['label_ko']}")
        return

    if args.job:
        job = find_job_by_id(args.job)
        if not job:
            print(f"Unknown job id: {args.job}. Use --list to see options.")
            sys.exit(1)
        generate_one_job(job, dry_run=args.dry_run)
        update_manifest()
        return

    targets = JOB_CATALOG
    if args.skip_existing:
        targets = [j for j in targets
                   if not os.path.isfile(os.path.join(JOBS_DIR, j["id"], "evolution.json"))]
        print(f"[Plan] {len(targets)} job(s) to generate "
              f"(skipping {len(JOB_CATALOG) - len(targets)} already done).")

    for j in targets:
        try:
            generate_one_job(j, dry_run=args.dry_run)
        except Exception as e:
            print(f"[Error] Job {j['id']} crashed: {e}")
    update_manifest()


if __name__ == "__main__":
    main()
