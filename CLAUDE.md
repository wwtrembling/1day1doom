# 1Day1Doom — Project rules for Claude

## Translation / multilingual copy

- **항상 각 언어 native 전문가(서브에이전트)를 호출해 검토받은 뒤 카피를 적용한다.** 직접 번역하거나 한 언어 카피라이터에게 6개 언어를 모두 맡기지 않는다.
- 지원 로케일: `ko`, `en`, `ja`, `zh-tw`, `es`, `de` (총 6개).
- 번역은 의미 동치보다 **각 언어 시장의 자연스러운 viral hook / 헤드라인 관습**을 우선. 같은 컨셉을 6언어 번역하지 말고, 각 언어가 그 시장에서 자연스러운 카피를 갖도록 따로 작성한다.
- 톤·심리 안전성이 걸린 변경(bias_label, doom path 본문 등)은 **임상심리/UX writing 관점도 추가 자문**.
- 변경 시 4지점을 모두 동기화: ① `docs/app.js` UI_TEXT, ② 각 locale HTML `<head>`의 4개 메타(title, description, og:title, og:description), ③ 각 locale HTML body fallback (`data-i18n` 노드의 텍스트), ④ 필요 시 `docs/public/data/quiz.json` / `evolution.json`.

## Branching

- 작업 단위마다 **새 브랜치**를 main에서 분기 (`claude/<short-topic>` 형식).
- 한 PR = 한 라운드. squash merge 후 다음 라운드는 새 브랜치에서.

## Plan persistence

- 각 라운드 플랜은 `/root/.claude/plans/b-master-purring-goblet.md` 상단에 누적. 과거 라운드 플랜은 보존(역사 기록).
