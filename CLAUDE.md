# 1Day1Doom — Project rules

## i18n

- 로케일: `ko`, `en`, `ja`, `zh-tw`, `es`, `de`
- 번역은 Claude가 직접 수행. 직역 금지 — 각 언어 시장에 자연스러운 카피로 작성.
- 텍스트 변경 시 4곳 동기화: ① `docs/app.js` UI_TEXT ② 각 locale HTML `<head>` 메타 ③ 각 locale HTML body fallback ④ 필요 시 `docs/public/data/` JSON

## 문체

- 사용자에게 보이는 모든 텍스트(UI, 결과 페이지, 범례, 판정문, 안내문)에서 전문용어·약어·업계 코드 금지. 비개발자 일반인이 바로 이해할 수 있는 말로 풀어 쓴다.
- 기준: "이 문장을 비개발자 친구에게 보여주면 바로 이해하나?"

## Branching

- `claude/<short-topic>` 형식으로 main에서 분기. 한 PR = 한 라운드.
