# scripts/build-data.py — Pivot v2 data pipeline

Builds the JSON data files under `docs/public/data/v2/` from two public sources.

## Sources

| # | Dataset | Author | License | URL |
|---|---|---|---|---|
| 1 | GPTs are GPTs (O*NET task statements, GPT-4 task exposure, BLS national May 2021 wages, BLS Employment Projections 2020-2030) | Eloundou, Manning, Mishkin, Rock (2023) | MIT | https://github.com/openai/GPTs-are-GPTs |
| 2 | AIOE: Occupational, Industry, and Geographic Exposure to AI | Felten, Raj, Seamans (2021) | Citation-requested (academic data) | https://github.com/AIOE-Data/AIOE |

Underlying raw data (BLS, O*NET) is © U.S. government (public domain) and the O*NET Center. The Eloundou repo aggregates these into a reproducible bundle, which is the form this pipeline consumes.

## Run

```sh
pip install openpyxl
python3 scripts/build-data.py
```

First run downloads ~9 MB of source data into `./data-sources/` (gitignored) and writes the JSON bundle. Subsequent runs reuse the cache; delete `data-sources/` to force re-download.

## Output (`docs/public/data/v2/`)

| File | Size | Shape |
|---|---|---|
| `meta.json` | ~1 KB | Build timestamp, source attribution, GPT-exposure label legend |
| `occupations.json` | ~44 KB | Array of 200 occupations: `soc`, `onet_soc`, `title`, `tot_emp`, `aioe`, `exp_alpha`/`beta`/`gamma` |
| `tasks.json` | ~860 KB | `{ soc → [task] }`. Each task: `id`, `task` (statement), `type` (Core/Supplemental), `gpt4` (T0–T4) |
| `wages.json` | ~22 KB | `{ soc → { p10, p25, median, p75, p90 } }` annual USD |
| `projections.json` | ~4 KB | `{ soc → pct_emp_change_2020_2030 }`, ~93% match rate |

## Selection

Top 200 detailed BLS occupations by total US employment that also have O*NET task data and Eloundou GPT exposure labels.

## Notes

- AIOE coverage is ~70% of the top-200 list (AIOE was published 2021 and excludes some newer codes).
- Projection match rate is ~93% — the remaining 14 occupations have no matching BLS title in the projections file (occupation hierarchy gap, not missing data).
- All occupations are US data. ko/ja/zh-tw/es/de locales display US baseline + an "accuracy notice" badge until v1.1 adds native datasets.
- GPT-4 exposure labels (T0–T4) come from GPT-4 itself rating each task, with a parallel human label set for validation. Both source columns are preserved in `tasks.json` indirectly; only `gpt4` is exposed in v1 UI.
