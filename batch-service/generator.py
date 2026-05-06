"""
Career Evolution Tree generator (schema v2 — dual path, 4 personas).

For each job in JOB_CATALOG:
  1. Ask Gemini for a dual-path tree + 4 persona blurbs + hook copy in ONE call.
  2. For each of 5 images (year0 + bloom_{10,30} + doom_{10,30}), ask Gemini
     to write an Imagen-ready prompt, then call Imagen.
  3. Write evolution.json (schema_version: 2) + 5 webps into
     docs/public/data/jobs/{job_id}/.
  4. Refresh docs/public/data/jobs.json manifest.
  5. Refresh docs/public/data/quiz.json (only if missing — the quiz is
     hand-tuned and shouldn't be silently overwritten).

Usage:
  python generator.py                    # generate every job in JOB_CATALOG
  python generator.py --job teacher      # one job only
  python generator.py --list             # list all job ids
  python generator.py --regenerate       # force re-gen even if already exists
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
from config import (JOB_CATALOG, STAGE_TONES, QUIZ_QUESTIONS_DEFAULT,
                    PERSONA_CATALOG, find_job_by_id)

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
QUIZ_PATH = os.path.join(PUBLIC_DATA_ROOT, 'quiz.json')

SCHEMA_VERSION = 2

# Doom-path compositions are intentionally generic and quiet — the per-job
# `composition.year_*` entries in JOB_CATALOG are bloom-themed (mentor energy,
# golden hour) and don't fit a sidelined doom narrative. We override them.
DOOM_COMPOSITIONS = {
    10: "in a quiet office or workspace where automated systems and AI agents handle most of the visible work; the character is positioned slightly to the side, calmly handling the smaller remaining manual tasks; cool overcast daylight, dignified posture",
    30: "in an environment that runs almost entirely on automation; the character is a peripheral, dignified, composed presence on the edge of the frame; soft neutral overcast light, no golden hour, no clutter, no dystopian decay"
}


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


def _build_image_tasks(job, tree):
    """Return list of (path, year, image_filename, stage_dict) tuples for the 5 images per job."""
    year0 = tree.get("year0", {})
    year0_stage = {"year": 0, "ko": year0.get("ko", {}), "en": year0.get("en", {})}

    tasks = [("bloom", 0, "stage_0.webp", year0_stage)]

    bloom_stages = (tree.get("paths", {}).get("bloom", {}).get("stages", []))
    for st in bloom_stages:
        y = st.get("year")
        if y in (10, 30):
            tasks.append(("bloom", y, f"bloom_{y}.webp", st))

    doom_stages = (tree.get("paths", {}).get("doom", {}).get("stages", []))
    for st in doom_stages:
        y = st.get("year")
        if y in (10, 30):
            tasks.append(("doom", y, f"doom_{y}.webp", st))

    return tasks


def _composition_for(job, path, year):
    if path == "doom" and year in DOOM_COMPOSITIONS:
        return DOOM_COMPOSITIONS[year]
    return job.get("composition", {}).get(f"year_{year}", "")


def generate_one_job(job, dry_run=False):
    """Generate full evolution tree (data + 5 images) for a single job."""
    job_id = job["id"]
    out_dir = os.path.join(JOBS_DIR, job_id)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n[Job: {job_id}] Generating dual-path evolution tree (schema v{SCHEMA_VERSION})...")

    if dry_run:
        print(f"  (dry-run) would generate evolution.json + 5 webps under {out_dir}")
        return True

    tree = llm_client.generate_evolution_tree(job)
    if not tree:
        print(f"[Job: {job_id}] FAILED to get evolution tree from LLM.")
        return False

    tree["schema_version"] = SCHEMA_VERSION
    tree["job_id"] = job_id
    tree["label_ko"] = job["label_ko"]
    tree["label_en"] = job["label_en"]
    tree["aliases_ko"] = job.get("aliases_ko", [])
    tree["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"

    # Validate persona block — keep going even if partially missing, but warn.
    personas = tree.get("personas", {})
    for p in PERSONA_CATALOG:
        code = p["code"]
        if code not in personas:
            print(f"[Job: {job_id}] WARNING: persona {code} missing in LLM output.")
        else:
            # Stamp deterministic bias from catalog (never trust LLM).
            personas[code]["bias"] = p["bias"]

    image_tasks = _build_image_tasks(job, tree)
    if len(image_tasks) != 5:
        print(f"[Job: {job_id}] WARNING: expected 5 image tasks, got {len(image_tasks)}. "
              f"Tree paths may be malformed.")

    def render_one(task):
        path, year, fname, stage = task
        tone_key = f"{path}_{year}" if year > 0 else "bloom_0"
        tone = STAGE_TONES.get(tone_key, "")
        comp = _composition_for(job, path, year)
        prompt = llm_client.generate_image_prompt(job, stage, tone, comp, path=path)
        if not prompt:
            prompt = (f"Pixar-style 3D render, {job['character_seed']}, "
                      f"as {stage.get('en', {}).get('title', job['label_en'])}, "
                      f"warm cinematic lighting")
        prompt = sanitize_image_prompt(prompt)
        debug_name = f"{fname.replace('.webp', '')}_prompt.txt"
        with open(os.path.join(out_dir, debug_name), "w", encoding="utf-8") as f:
            f.write(prompt)
        img_path = os.path.join(out_dir, fname)
        ok = llm_client.generate_image_from_text(prompt, img_path,
                                                 aspect_ratio="3:4")
        return (fname, ok)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
        results = list(ex.map(render_one, image_tasks))

    successes = sum(1 for _, ok in results if ok)
    print(f"[Job: {job_id}] {successes}/{len(results)} images rendered.")

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
        "version": 2,
        "schema_version": SCHEMA_VERSION,
        "quiz_version": QUIZ_QUESTIONS_DEFAULT["version"],
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "jobs": jobs,
    }
    with open(JOBS_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"[Manifest] Wrote {JOBS_MANIFEST_PATH} ({len(jobs)} jobs)")


def write_quiz_if_missing():
    """Write the default quiz file, but never overwrite an existing hand-tuned one."""
    if os.path.isfile(QUIZ_PATH):
        print(f"[Quiz] {QUIZ_PATH} already exists, leaving untouched.")
        return
    os.makedirs(PUBLIC_DATA_ROOT, exist_ok=True)
    with open(QUIZ_PATH, "w", encoding="utf-8") as f:
        json.dump(QUIZ_QUESTIONS_DEFAULT, f, indent=2, ensure_ascii=False)
    print(f"[Quiz] Wrote {QUIZ_PATH}")


def _is_schema_v2(job_id):
    p = os.path.join(JOBS_DIR, job_id, "evolution.json")
    if not os.path.isfile(p):
        return False
    try:
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("schema_version") == SCHEMA_VERSION
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--job", help="generate a single job by id (see --list)")
    parser.add_argument("--list", action="store_true", help="list all job ids and exit")
    parser.add_argument("--dry-run", action="store_true",
                        help="don't call any API, just verify config")
    parser.add_argument("--skip-existing", action="store_true",
                        help="skip jobs already at schema v2")
    parser.add_argument("--regenerate", action="store_true",
                        help="force re-gen everything (override --skip-existing)")
    args = parser.parse_args()

    if args.list:
        for j in JOB_CATALOG:
            print(f"  {j['id']:24s} {j['label_ko']}")
        return

    write_quiz_if_missing()

    if args.job:
        job = find_job_by_id(args.job)
        if not job:
            print(f"Unknown job id: {args.job}. Use --list to see options.")
            sys.exit(1)
        generate_one_job(job, dry_run=args.dry_run)
        update_manifest()
        return

    targets = JOB_CATALOG
    if args.skip_existing and not args.regenerate:
        targets = [j for j in targets if not _is_schema_v2(j["id"])]
        print(f"[Plan] {len(targets)} job(s) to generate "
              f"(skipping {len(JOB_CATALOG) - len(targets)} already at v{SCHEMA_VERSION}).")

    for j in targets:
        try:
            generate_one_job(j, dry_run=args.dry_run)
        except Exception as e:
            print(f"[Error] Job {j['id']} crashed: {e}")
    update_manifest()


if __name__ == "__main__":
    main()
