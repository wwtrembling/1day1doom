# 1Day1Evolve (1일 1진화)

**"AI가 내 직업을 먹기 전에, 내가 먼저 진화한다."**

1Day1Evolve는 AI 시대 직업 대체 불안을 가진 사용자에게 자기 직업의 30년 진화 트리를 포켓몬식 3단 카드로 보여주는 웹앱입니다. Google Gemini로 진화 시나리오를 생성하고, Imagen으로 단계별 일러스트를 만들어 정적 사이트(GitHub Pages)에서 즉시 서빙합니다.

> 이 프로젝트는 원래 "1일 1멸망"(매일 새 멸망 시나리오) 컨셉으로 시작했지만, 단조로운 톤과 평범한 일러스트 문제로 정반대 컨셉(희망/통제감)으로 피벗했습니다. 도메인(1day1doom.com)은 그대로 유지합니다.

## 컨셉

```
[입력] 직업: "백엔드 개발자"
       ↓
┌────────────┐  →  ┌────────────┐  →  ┌────────────┐
│ 지금         │     │ 10년 후      │     │ 30년 후      │
│ 백엔드 개발자│     │ AI 워크플로우│     │ 인간-AI 협업 │
│              │     │ 디자이너      │     │ 컨설턴트      │
└────────────┘     └────────────┘     └────────────┘
```

각 단계마다:
- 직업명 + 핵심 역량 3개 + 1-2문장 묘사 (한국어/영어)
- 단계별 톤이 다른 Pixar 스타일 일러스트 (3:4 비율, 인스타 카드용)

핵심 트릭: **사용자가 입력할 때마다 LLM을 호출하지 않습니다.** 자주 쓰는 직업 30개를 사전에 일괄 생성해 정적 파일로 서빙합니다. 자유 입력은 클라이언트에서 별칭(alias) 매칭.

## 디렉터리 구조

```
1day1doom/
├── batch-service/                # Python 배치 생성기
│   ├── generator.py              # 메인 (--job <id> / --all / --skip-existing)
│   ├── llm_client.py             # Gemini + Imagen SDK 래퍼
│   ├── config.py                 # JOB_CATALOG (30개 직업) + STAGE_TONES
│   └── prompt/
│       ├── evolution_tree.json   # 3단 진화 데이터 생성 프롬프트
│       └── image_prompt.json     # 단계별 Imagen 프롬프트 작성 프롬프트
└── docs/                         # 정적 웹앱 (GitHub Pages)
    ├── ko/, en/                  # 다국어 진입점
    ├── app.js                    # 검색/카드 렌더/공유
    ├── style.css
    └── public/data/
        ├── jobs.json             # 직업 카탈로그 매니페스트
        └── jobs/<job_id>/
            ├── evolution.json    # 3단 진화 데이터 (ko + en)
            ├── stage_0.webp      # 현재 일러스트
            ├── stage_10.webp     # 10년 후
            └── stage_30.webp     # 30년 후
```

## 실행

### 1. 콘텐츠 생성 (배치)

```bash
cd batch-service
pip install google-genai python-dotenv pillow
echo "GEMINI_API_KEY=your_key_here" > .env

python generator.py --list                # 직업 목록 보기
python generator.py --job teacher         # 한 직업만 (테스트용)
python generator.py                       # 전체 30개 일괄 생성
python generator.py --skip-existing       # 누락분만
```

비용 가이드 (Imagen 4 Fast 기준): 1직업 = 진화 트리 1회 + 이미지 3장 ≈ $0.06–0.12. 전체 30개 ≈ $2–4.

### 2. 웹 미리보기

```bash
cd docs
python -m http.server 8000
# 브라우저: http://localhost:8000/ko/   또는   /en/
```

이미지 파일이 아직 없는 직업은 카드에서 ✨ 자리표시자로 표시됩니다 (텍스트는 정상).

## 프롬프트 가이드

- `prompt/evolution_tree.json` — 3단 진화 직업명·스킬·설명을 JSON으로 한 번에 출력. 시스템 프롬프트는 "AI는 직업을 없애는 게 아니라 진화시키는 도구" 라는 철학을 강제.
- `prompt/image_prompt.json` — 단계별 캐릭터 일러스트 프롬프트 작성. `STAGE_TONES`(현재=cool daylight, 10년=warm + holographic UI, 30년=golden hour mentor)로 톤 차별화. `character_seed`(JOB_CATALOG에 정의)로 3단 동안 동일 인물 유지.

## 데이터 스키마

`docs/public/data/jobs/<job_id>/evolution.json`:

```jsonc
{
  "job_id": "backend_developer",
  "label_ko": "백엔드 개발자",
  "label_en": "Backend Developer",
  "share_caption": { "ko": "...", "en": "..." },
  "stages": [
    {
      "year": 0,
      "image": "stage_0.webp",
      "ko": { "title": "...", "skills": ["..."], "description": "..." },
      "en": { "title": "...", "skills": ["..."], "description": "..." }
    },
    { "year": 10, ... },
    { "year": 30, ... }
  ]
}
```

## 라이선스

오픈 소스.
