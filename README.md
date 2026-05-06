# 1Day1Doom

> **AI가 내 직업을 잡아먹나? — 5문항으로 30년 두 갈래 운명을 본다.**
>
> Will AI eat your job? Diagnose your 30-year split fate in 5 questions.

직업 + 5문항 → 4 페르소나 중 1개 + Doom Path / Bloom Path 두 갈래 진화 트리. 한 페이지에서 끝나는 진단 위젯입니다.

## 구조

```
1day1doom/
├── README.md
└── docs/                          # 정적 사이트 (GitHub Pages, 빌드 스텝 없음)
    ├── index.html                 # 브라우저 언어 기반 리다이렉트
    ├── ko/index.html              # 한국어
    ├── en/index.html              # English
    ├── ja/index.html              # 日本語
    ├── app.js                     # 단일 페이지 SPA (state machine + N-language)
    ├── style.css
    ├── public/og-image.jpg        # 정적 OG 카드 (모든 공유에서 동일)
    └── public/data/
        ├── jobs.json              # 직업 매니페스트 (12개) + locales 목록
        ├── quiz.json              # 5문항 진단 (ko/en/ja)
        └── jobs/<job_id>/
            └── evolution.json     # year0 + bloom/doom × (10/30년) + 4 페르소나 (ko/en, ja는 fallback)
```

이미지 자산 없음. 카드 비주얼은 직업별 이모지 + path별 색조(bloom=따뜻, doom=차가움)로 처리합니다.

## 콘텐츠 추가/수정

모든 컨텐츠는 손으로 유지보수. Python·LLM 배치 없음.

### 새 직업 추가

1. `docs/public/data/jobs/<new_id>/evolution.json` 생성. 기존 직업 파일을 복사해 스키마 v2 그대로 채움 (`year0`, `paths.bloom.stages[10/30]`, `paths.doom.stages[10/30]`, `personas.{AS,AC,RS,RC}`, `hook_copy`, `share_caption`, `emoji`).
2. `docs/public/data/jobs.json`의 `jobs` 배열에 `{id, label_ko, label_en, label_ja, emoji, aliases_ko}` 항목 추가.
3. 페이지 새로고침이면 끝. 자동완성에 즉시 노출.

### 톤 가이드

- **doomer 영역**: hero 슬로건, OG 메타, 페르소나 닉네임, 공유 캡션, hook copy. 자조·풍자 톤 OK.
- **정보형 영역**: 결과 본문(stage description, persona blurb). 광고주 친화적인 중립 톤. 자극·욕설 단어 금지.

## 페르소나 4종

5문항 → 2축 (AR: AI 적응 vs 저항 / SC: 협업 vs 솔로) → 4 코드.

| 코드 | 성향 | 자연 결말 |
|---|---|---|
| AS | 적응 + 솔로 | bloom |
| AC | 적응 + 협업 | bloom |
| RS | 저항 + 솔로 | doom |
| RC | 저항 + 협업 | doom |

결과 페이지는 두 path 모두 보여주되, 페르소나의 자연 결말 path를 ★로 강조합니다.

## 로컬 미리보기

```bash
cd docs && python3 -m http.server 8000
# 브라우저: http://localhost:8000/ko/   /en/   /ja/
```

## 라이선스

오픈 소스.
