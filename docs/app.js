// 1Day1Doom v2 — Personal Risk Dashboard
// Round 6 pivot. The user enters a job (autocomplete) and age cohort;
// the result page renders dashboard panels (filled by later PRs).

"use strict";

const UI_TEXT = {
    ko: {
        app_title: "1Day1Doom",
        slogan: "AI 시대, 내 직업은 안녕할까?",
        input_title: "직업과 연령대를 알려주세요",
        label_job: "직업",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "연령대",
        age_20s: "20대",
        age_30s: "30대",
        age_40s: "40대",
        age_50p: "50대+",
        hint: "한국어·영어 직업명 모두 검색 가능해요.",
        btn_see_dashboard: "내 대시보드 보기",
        btn_share: "결과 공유하기",
        btn_restart: "다른 직업으로 다시 하기",
        result_job_label: "직업",
        result_age_label: "연령대",
        result_subtitle: "이 직업이 실제로 하는 일을 하나씩 뜯어보고, AI가 얼마나 영향을 미치는지 분석했어요.",
        panel_task_title: "업무별 AI 영향도",
        panel_task_subtitle: "이 직업이 하는 일을 업무 단위로 나눠서, 각각 AI가 얼마나 대체할 수 있는지 표시했어요.",
        panel_cohort_title: "내 위치 + 팩트체크",
        panel_cohort_subtitle: "비슷한 직업군과 비교한 내 위치 + 막연한 불안을 줄여줄 객관 데이터.",
        panel_coming_soon: "곧 추가될 예정이에요.",
        task_summary: "총 {n}개 업무의 AI 영향도",
        task_show_more: "더 보기",
        task_show_less: "접기",
        task_type_core: "핵심",
        task_type_supplemental: "보조",
        legend_T0: "AI 영향 없음",
        legend_T1: "AI가 바로 대체 가능",
        legend_T2: "AI+도구로 대체 가능",
        legend_T3: "이미지 AI 영역",
        legend_T4: "아직 불확실",
        legend_T0_desc: "이 업무는 AI로 시간을 크게 줄일 수 없어요.",
        legend_T1_desc: "ChatGPT 같은 AI만으로도 이 업무 시간의 절반 이상을 줄일 수 있어요.",
        legend_T2_desc: "AI에 코딩 도구 등을 결합하면 이 업무 시간의 절반 이상을 줄일 수 있어요.",
        legend_T3_desc: "이미지 생성 AI가 영향을 미치는 업무예요.",
        legend_T4_desc: "AI 영향이 부분적이거나 아직 판단이 어려운 업무예요.",
        verdict_high: "이 직업의 업무 대부분을 AI가 빠르게 처리할 수 있어요. 변화에 대비가 필요해요.",
        verdict_mid: "이 직업의 업무 중 상당 부분에 AI가 영향을 줄 수 있어요. 미리 준비하면 유리해요.",
        verdict_low: "이 직업은 AI 영향이 적은 편이에요. 당장 큰 변화는 없을 가능성이 높아요.",
        cohort_position_title: "200개 직업 중 내 위치",
        cohort_position_subtitle: "AI 영향을 많이 받는 순서로 정렬한 분포",
        cohort_percentile: "이 직업은 AI 영향 상위 {p}%에 해당해요",
        cohort_axis_left: "← AI 영향 적음",
        cohort_axis_right: "AI 영향 큼 →",
        reality_check_title: "잠깐, 너무 걱정하지 마세요",
        reality_check_intro: "'AI가 일자리를 없앤다'는 보도가 자주 빠뜨리는 4가지 사실.",
        reality_card_1_head: "과거 자동화 예측은 자주 빗나가요",
        reality_card_1_body: "ATM 도입 후 미국 뱅크텔러는 1980 50만 → 2010 60만으로 늘었어요. 지점이 싸져 더 많이 만들어졌어요.",
        reality_card_2_head: "같은 데이터, 다른 결론",
        reality_card_2_body: "Frey-Osborne 2013은 미국 직업 47%가 '고위험'이라 했지만, OECD 2016 재추정은 9%. 실제 2013-23 실업률은 평균 4%대였어요.",
        reality_card_3_head: "새 직업이 만들어져요",
        reality_card_3_body: "Autor 2024 분석: 2018년 미국 고용의 60%는 1940년에 없던 직업이에요. 자동화는 새 직업도 만들어요.",
        reality_card_4_head: "노출 ≠ 대체",
        reality_card_4_body: "Acemoglu 2024 추정: 향후 10년 AI 영향은 GDP +0.5–0.9%. '대량 실업' 시나리오는 아니에요.",
        accuracy_notice: "이 분석은 미국 노동부 데이터 기반이에요. 한국 상황과 다를 수 있어요.",
        msg_share_done: "링크를 복사했어요. 어디든 붙여넣어 보세요!",
        msg_no_match: "그 직업은 아직 v1에 없어요. 비슷한 영어 직업명으로 시도해 주세요.",
        msg_pick_age: "연령대도 선택해 주세요.",
        footer_tagline: "AI 시대 직업 좌표 대시보드"
    },
    en: {
        app_title: "1Day1Doom",
        slogan: "Is your job AI-proof?",
        input_title: "Your job and age",
        label_job: "Job",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "Age",
        age_20s: "20s",
        age_30s: "30s",
        age_40s: "40s",
        age_50p: "50+",
        hint: "Search by English job title.",
        btn_see_dashboard: "See my dashboard",
        btn_share: "Share my dashboard",
        btn_restart: "Try another job",
        result_job_label: "Job",
        result_age_label: "Age",
        result_subtitle: "We broke this job into individual tasks and analyzed how much AI can handle each one.",
        panel_task_title: "AI impact by task",
        panel_task_subtitle: "Each task in this job, scored by how much AI can replace it.",
        panel_cohort_title: "Your position + Fact check",
        panel_cohort_subtitle: "Where you stand vs. similar jobs + data to keep things in perspective.",
        panel_coming_soon: "Coming soon.",
        task_summary: "AI impact across {n} tasks",
        task_show_more: "Show more",
        task_show_less: "Show less",
        task_type_core: "Core",
        task_type_supplemental: "Supplemental",
        legend_T0: "AI-proof",
        legend_T1: "AI can replace directly",
        legend_T2: "AI + tools can replace",
        legend_T3: "Image AI domain",
        legend_T4: "Uncertain",
        legend_T0_desc: "AI can't significantly speed up this task (<50%).",
        legend_T1_desc: "An LLM alone can cut 50%+ of the time on this task.",
        legend_T2_desc: "LLM with coding tools or interfaces can cut 50%+.",
        legend_T3_desc: "Image-generation AI impacts this task.",
        legend_T4_desc: "Partial or uncertain AI impact.",
        verdict_high: "Most tasks in this job can be done faster by AI. Upskilling is strongly recommended.",
        verdict_mid: "A significant portion of tasks are AI-affected. Staying ahead of the curve will help.",
        verdict_low: "This job has relatively low AI exposure. Major disruption is unlikely in the near term.",
        cohort_position_title: "Your position among 200 occupations",
        cohort_position_subtitle: "Ranked by AI exposure, highest to lowest",
        cohort_percentile: "This job is in the top {p}% for AI exposure",
        cohort_axis_left: "← Less AI impact",
        cohort_axis_right: "More AI impact →",
        reality_check_title: "Wait — don't panic yet",
        reality_check_intro: "4 facts the 'AI will take your job' headlines usually leave out.",
        reality_card_1_head: "Past automation predictions often miss",
        reality_card_1_body: "After ATMs, US bank tellers grew from 500k (1980) to 600k (2010). Cheaper branches meant more branches were opened.",
        reality_card_2_head: "Same data, different conclusions",
        reality_card_2_body: "Frey-Osborne 2013 said 47% of US jobs were 'high-risk.' OECD 2016 re-estimated 9%. Actual 2013-23 unemployment averaged ~4%.",
        reality_card_3_head: "New jobs are created",
        reality_card_3_body: "Autor 2024: 60% of 2018 US employment is in occupations that didn't exist in 1940. Automation also creates jobs.",
        reality_card_4_head: "Exposure ≠ replacement",
        reality_card_4_body: "Acemoglu 2024: AI's labor-market impact over 10 years is ~+0.5–0.9% GDP. Not a 'mass unemployment' scenario.",
        accuracy_notice: "This analysis is based on US Department of Labor data. Your local market may differ.",
        msg_share_done: "Link copied. Paste anywhere.",
        msg_no_match: "That job isn't in v1 yet. Try a similar English title.",
        msg_pick_age: "Pick an age cohort too.",
        footer_tagline: "Career coordinates for the AI era"
    },
    ja: {
        app_title: "1Day1Doom",
        slogan: "AI時代、その仕事は残る？",
        input_title: "職業と年齢層を教えてください",
        label_job: "職業",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "年齢層",
        age_20s: "20代",
        age_30s: "30代",
        age_40s: "40代",
        age_50p: "50代+",
        hint: "日本語・英語どちらでも検索できます。",
        btn_see_dashboard: "ダッシュボードを見る",
        btn_share: "結果をシェア",
        btn_restart: "別の職業で試す",
        result_job_label: "職業",
        result_age_label: "年齢層",
        result_subtitle: "この職業が実際にやっている業務をひとつずつ分解し、AIの影響度を分析しました。",
        panel_task_title: "業務ごとの AI 影響度",
        panel_task_subtitle: "この職業の業務を分解し、それぞれAIがどれだけ代替できるか表示しています。",
        panel_cohort_title: "あなたの位置 + ファクトチェック",
        panel_cohort_subtitle: "似た職業群との比較 + 漠然とした不安を和らげる客観データ。",
        panel_coming_soon: "近日追加予定です。",
        task_summary: "全{n}業務のAI影響度",
        task_show_more: "もっと見る",
        task_show_less: "閉じる",
        task_type_core: "コア",
        task_type_supplemental: "補助",
        legend_T0: "AI影響なし",
        legend_T1: "AIが直接代替可能",
        legend_T2: "AI+ツールで代替可能",
        legend_T3: "画像AI領域",
        legend_T4: "不確実",
        legend_T0_desc: "この業務はAIで大幅な時間短縮ができません。",
        legend_T1_desc: "ChatGPTなどのAIだけでこの業務時間の半分以上を短縮できます。",
        legend_T2_desc: "AIにコーディングツール等を組み合わせると半分以上短縮できます。",
        legend_T3_desc: "画像生成AIが影響する業務です。",
        legend_T4_desc: "AI影響が部分的、または判断が難しい業務です。",
        verdict_high: "この職業の業務の大半をAIが素早く処理できます。スキルアップの準備を強くお勧めします。",
        verdict_mid: "この職業の業務のかなりの部分にAIが影響します。先手を打てば有利です。",
        verdict_low: "この職業はAI影響が比較的少ないです。当面、大きな変化は起きにくいでしょう。",
        cohort_position_title: "200職業中のあなたの位置",
        cohort_position_subtitle: "AI影響度が高い順に並べた分布",
        cohort_percentile: "この職業はAI影響度の上位{p}%です",
        cohort_axis_left: "← AI影響少",
        cohort_axis_right: "AI影響大 →",
        reality_check_title: "ちょっと待って、慌てないで",
        reality_check_intro: "「AIが仕事を奪う」という報道がよく省く4つの事実。",
        reality_card_1_head: "過去の自動化予測はしばしば外れる",
        reality_card_1_body: "ATM 導入後、米国の銀行窓口係は 1980 年 50 万人 → 2010 年 60 万人に増加。支店コストが下がり、店舗数が増えたためです。",
        reality_card_2_head: "同じデータ、異なる結論",
        reality_card_2_body: "Frey-Osborne 2013 は米国職業の 47% が「高リスク」と予測。OECD 2016 の再推計は 9%。実際 2013-23 の失業率は平均約 4%。",
        reality_card_3_head: "新しい職業が生まれている",
        reality_card_3_body: "Autor 2024：2018 年の米国雇用の 60% は 1940 年に存在しなかった職業。自動化は新しい職業も作る。",
        reality_card_4_head: "影響 ≠ 代替",
        reality_card_4_body: "Acemoglu 2024 推計：今後 10 年の AI 労働市場への影響は GDP 比 +0.5–0.9%。「大量失業」シナリオではない。",
        accuracy_notice: "この分析は米国労働省のデータに基づいています。日本の状況とは異なる場合があります。",
        msg_share_done: "リンクをコピーしました。どこへでも貼り付けてください。",
        msg_no_match: "その職業は v1 に未対応。近い英語職業名でお試しください。",
        msg_pick_age: "年齢層も選択してください。",
        footer_tagline: "AI 時代のキャリア座標ダッシュボード"
    },
    "zh-tw": {
        app_title: "1Day1Doom",
        slogan: "你的工作，撐得過 AI 嗎？",
        input_title: "你的職業與年齡層",
        label_job: "職業",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "年齡層",
        age_20s: "20 多歲",
        age_30s: "30 多歲",
        age_40s: "40 多歲",
        age_50p: "50+",
        hint: "中文、英文職業名皆可搜尋。",
        btn_see_dashboard: "看我的儀表板",
        btn_share: "分享結果",
        btn_restart: "換個職業再試",
        result_job_label: "職業",
        result_age_label: "年齡層",
        result_subtitle: "這個職業實際在做的工作逐一拆解，分析 AI 影響多大。",
        panel_task_title: "各項工作的 AI 影響度",
        panel_task_subtitle: "把這個職業拆成一項項工作，標出 AI 能取代多少。",
        panel_cohort_title: "我的位置 + 事實查核",
        panel_cohort_subtitle: "跟類似職業比，你在哪 + 降低焦慮的客觀數據。",
        panel_coming_soon: "即將推出。",
        task_summary: "共 {n} 項工作的 AI 影響度",
        task_show_more: "看更多",
        task_show_less: "收起",
        task_type_core: "核心",
        task_type_supplemental: "輔助",
        legend_T0: "AI 影響不大",
        legend_T1: "AI 可直接取代",
        legend_T2: "AI+工具可取代",
        legend_T3: "圖像 AI 領域",
        legend_T4: "尚不確定",
        legend_T0_desc: "這項工作 AI 無法大幅縮短時間。",
        legend_T1_desc: "ChatGPT 等 AI 就能省下這項工作一半以上時間。",
        legend_T2_desc: "AI 搭配程式工具等，能省下一半以上時間。",
        legend_T3_desc: "圖像生成 AI 影響的工作。",
        legend_T4_desc: "AI 影響部分或難以判斷。",
        verdict_high: "這個職業的多數工作 AI 都能快速處理。建議積極準備轉型。",
        verdict_mid: "這個職業有不少工作會受 AI 影響。提早準備會更有利。",
        verdict_low: "這個職業受 AI 影響較小。短期內大變動的可能性不高。",
        cohort_position_title: "200 個職業中你的位置",
        cohort_position_subtitle: "依 AI 影響度由高到低排列",
        cohort_percentile: "這個職業在 AI 影響度前 {p}%",
        cohort_axis_left: "← AI 影響小",
        cohort_axis_right: "AI 影響大 →",
        reality_check_title: "先別慌",
        reality_check_intro: "「AI 要搶你工作」的報導經常漏掉的 4 件事。",
        reality_card_1_head: "過去的自動化預測常常落空",
        reality_card_1_body: "ATM 普及後，美國銀行櫃員從 1980 的 50 萬增加到 2010 的 60 萬。分行成本下降，反而開了更多分行。",
        reality_card_2_head: "同樣資料，不同結論",
        reality_card_2_body: "Frey-Osborne 2013 說美國 47% 工作「高風險」。OECD 2016 重新估算為 9%。實際 2013-23 失業率平均約 4%。",
        reality_card_3_head: "新工作正在誕生",
        reality_card_3_body: "Autor 2024 分析：2018 美國 60% 的就業在 1940 年並不存在。自動化也創造新工作。",
        reality_card_4_head: "暴露 ≠ 取代",
        reality_card_4_body: "Acemoglu 2024 估計：未來 10 年 AI 對勞動市場影響約 GDP +0.5–0.9%，非「大規模失業」場景。",
        accuracy_notice: "本分析基於美國勞工部數據，台灣市場情況可能不同。",
        msg_share_done: "已複製連結。貼到任何地方都可以。",
        msg_no_match: "v1 還沒收錄這個職業。請試試相近的英文職業名。",
        msg_pick_age: "也請選擇年齡層。",
        footer_tagline: "AI 時代的職業座標儀表板"
    },
    es: {
        app_title: "1Day1Doom",
        slogan: "¿Tu trabajo sobrevive a la IA?",
        input_title: "Tu profesión y edad",
        label_job: "Profesión",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "Edad",
        age_20s: "20s",
        age_30s: "30s",
        age_40s: "40s",
        age_50p: "50+",
        hint: "Busca en español o en inglés.",
        btn_see_dashboard: "Ver mi panel",
        btn_share: "Compartir mi panel",
        btn_restart: "Probar otra profesión",
        result_job_label: "Profesión",
        result_age_label: "Edad",
        result_subtitle: "Desglosamos las tareas reales de esta profesión y analizamos cuánto puede la IA en cada una.",
        panel_task_title: "Impacto de IA por tarea",
        panel_task_subtitle: "Cada tarea de esta profesión, con su nivel de impacto de IA.",
        panel_cohort_title: "Tu posición + Verificación",
        panel_cohort_subtitle: "Dónde estás frente a profesiones similares + datos para calmar la ansiedad.",
        panel_coming_soon: "Próximamente.",
        task_summary: "Impacto de IA en {n} tareas",
        task_show_more: "Ver más",
        task_show_less: "Ver menos",
        task_type_core: "Esencial",
        task_type_supplemental: "Suplementario",
        legend_T0: "Sin impacto IA",
        legend_T1: "IA puede reemplazar",
        legend_T2: "IA + herramientas reemplazan",
        legend_T3: "IA de imágenes",
        legend_T4: "Incierto",
        legend_T0_desc: "La IA no puede acelerar esta tarea significativamente.",
        legend_T1_desc: "ChatGPT u otra IA puede reducir más de la mitad del tiempo de esta tarea.",
        legend_T2_desc: "IA con herramientas de código, etc. reduce más de la mitad del tiempo.",
        legend_T3_desc: "Tarea impactada por IA de generación de imágenes.",
        legend_T4_desc: "Impacto parcial o difícil de determinar.",
        verdict_high: "La mayoría de las tareas de esta profesión pueden ser realizadas más rápido por IA. Se recomienda prepararse.",
        verdict_mid: "Una parte significativa de las tareas se ve afectada por IA. Anticiparse es una ventaja.",
        verdict_low: "Esta profesión tiene relativamente poco impacto de IA. Es poco probable un cambio drástico a corto plazo.",
        cohort_position_title: "Tu posición entre 200 profesiones",
        cohort_position_subtitle: "Ordenadas de mayor a menor impacto de IA",
        cohort_percentile: "Esta profesión está en el top {p}% de impacto IA",
        cohort_axis_left: "← Menos impacto IA",
        cohort_axis_right: "Más impacto IA →",
        reality_check_title: "Calma — no te apures",
        reality_check_intro: "4 hechos que los titulares de 'la IA te quitará el trabajo' suelen omitir.",
        reality_card_1_head: "Las predicciones de automatización suelen fallar",
        reality_card_1_body: "Tras los cajeros automáticos, los cajeros bancarios en EE. UU. crecieron de 500k (1980) a 600k (2010). Sucursales más baratas significan más sucursales.",
        reality_card_2_head: "Mismos datos, distintas conclusiones",
        reality_card_2_body: "Frey-Osborne 2013 estimó 47% de empleos en 'alto riesgo'. La OCDE en 2016 lo reestimó en 9%. El desempleo real 2013-23 promedió ~4%.",
        reality_card_3_head: "Se crean nuevos empleos",
        reality_card_3_body: "Autor 2024: el 60% del empleo de EE. UU. en 2018 está en ocupaciones que no existían en 1940. La automatización también crea empleos.",
        reality_card_4_head: "Exposición ≠ reemplazo",
        reality_card_4_body: "Acemoglu 2024: el impacto laboral de la IA en 10 años es ~+0,5–0,9% del PIB. No es un escenario de 'desempleo masivo'.",
        accuracy_notice: "Este análisis se basa en datos del Departamento de Trabajo de EE. UU. Tu mercado local puede ser diferente.",
        msg_share_done: "Enlace copiado. Pégalo donde quieras.",
        msg_no_match: "Esa profesión aún no está en v1. Prueba un título en inglés similar.",
        msg_pick_age: "Elige también una franja de edad.",
        footer_tagline: "Coordenadas profesionales para la era de la IA"
    },
    de: {
        app_title: "1Day1Doom",
        slogan: "Frisst KI deinen Job?",
        input_title: "Deine Tätigkeit und dein Alter",
        label_job: "Tätigkeit",
        placeholder_job: "Software Developer, Teacher, Registered Nurse…",
        label_age: "Alter",
        age_20s: "20er",
        age_30s: "30er",
        age_40s: "40er",
        age_50p: "50+",
        hint: "Suche auf Deutsch oder Englisch.",
        btn_see_dashboard: "Mein Dashboard zeigen",
        btn_share: "Dashboard teilen",
        btn_restart: "Anderen Beruf testen",
        result_job_label: "Beruf",
        result_age_label: "Alter",
        result_subtitle: "Wir haben die Aufgaben dieses Berufs einzeln analysiert — und geschaut, wie stark KI jeweils eingreifen kann.",
        panel_task_title: "KI-Einfluss pro Aufgabe",
        panel_task_subtitle: "Jede Aufgabe dieses Berufs, bewertet nach KI-Ersetzbarkeit.",
        panel_cohort_title: "Deine Position + Faktencheck",
        panel_cohort_subtitle: "Wo du im Vergleich stehst + Daten, die übertriebene Angst relativieren.",
        panel_coming_soon: "Kommt bald.",
        task_summary: "KI-Einfluss auf {n} Aufgaben",
        task_show_more: "Mehr anzeigen",
        task_show_less: "Ausblenden",
        task_type_core: "Kern",
        task_type_supplemental: "Ergänzend",
        legend_T0: "Kein KI-Einfluss",
        legend_T1: "KI kann direkt ersetzen",
        legend_T2: "KI + Tools ersetzen",
        legend_T3: "Bild-KI-Bereich",
        legend_T4: "Unsicher",
        legend_T0_desc: "KI kann diese Aufgabe nicht wesentlich beschleunigen.",
        legend_T1_desc: "ChatGPT o.Ä. kann bei dieser Aufgabe über die Hälfte der Zeit sparen.",
        legend_T2_desc: "KI mit Programmier-Tools usw. spart über die Hälfte der Zeit.",
        legend_T3_desc: "Aufgabe, die von Bild-KI betroffen ist.",
        legend_T4_desc: "Teilweiser oder schwer einschätzbarer KI-Einfluss.",
        verdict_high: "Die meisten Aufgaben dieses Berufs kann KI schneller erledigen. Weiterbildung ist dringend empfohlen.",
        verdict_mid: "Ein erheblicher Teil der Aufgaben ist KI-betroffen. Frühzeitig vorbereiten lohnt sich.",
        verdict_low: "Dieser Beruf hat relativ wenig KI-Einfluss. Kurzfristig ist kein großer Umbruch zu erwarten.",
        cohort_position_title: "Deine Position unter 200 Berufen",
        cohort_position_subtitle: "Nach KI-Einfluss sortiert, von hoch nach niedrig",
        cohort_percentile: "Dieser Beruf liegt in den obersten {p}% beim KI-Einfluss",
        cohort_axis_left: "← Weniger KI-Einfluss",
        cohort_axis_right: "Mehr KI-Einfluss →",
        reality_check_title: "Moment — keine Panik",
        reality_check_intro: "4 Fakten, die in 'KI nimmt dir den Job'-Schlagzeilen oft fehlen.",
        reality_card_1_head: "Automatisierungsprognosen liegen oft daneben",
        reality_card_1_body: "Nach Geldautomaten stieg die Zahl der US-Bankangestellten von 500k (1980) auf 600k (2010). Günstigere Filialen führten zu mehr Filialen.",
        reality_card_2_head: "Gleiche Daten, andere Schlussfolgerungen",
        reality_card_2_body: "Frey-Osborne 2013 sah 47% der US-Jobs als 'hochrisikoreich'. OECD 2016 schätzte 9%. Die Arbeitslosigkeit 2013-23 lag im Schnitt bei ~4%.",
        reality_card_3_head: "Neue Berufe entstehen",
        reality_card_3_body: "Autor 2024: 60% der US-Beschäftigung 2018 entfallen auf Berufe, die es 1940 nicht gab. Automatisierung schafft auch neue Jobs.",
        reality_card_4_head: "Exposition ≠ Ersatz",
        reality_card_4_body: "Acemoglu 2024 schätzt den KI-Arbeitsmarkteffekt über 10 Jahre auf ~+0,5–0,9% BIP. Kein 'Massenarbeitslosigkeit'-Szenario.",
        accuracy_notice: "Diese Analyse basiert auf Daten des US-Arbeitsministeriums. Dein lokaler Markt kann abweichen.",
        msg_share_done: "Link kopiert. Überall einfügen.",
        msg_no_match: "Dieser Beruf ist in v1 noch nicht dabei. Versuche einen ähnlichen englischen Titel.",
        msg_pick_age: "Wähle auch eine Altersgruppe.",
        footer_tagline: "Karriere-Koordinaten für das KI-Zeitalter"
    }
};

const DATA_BASE = "../public/data/v2";
const AGE_COHORTS = ["20s", "30s", "40s", "50p"];
const TASK_LABELS = ["T0", "T1", "T2", "T3", "T4"];
const TASKS_VISIBLE_INITIAL = 8;

const state = {
    lang: "ko",
    occupations: null,   // array from v2/occupations.json
    meta: null,
    tasks: null,         // { soc → [task] }, lazy-loaded
    tasksLoading: null,  // in-flight promise
    selected: { soc: null, onet_soc: null, age: null }
};

let currentLang = "ko";

// ------- helpers --------------------------------------------------

function t(key) {
    return (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) || UI_TEXT.en[key] || key;
}

function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function trackEvent(name, params) {
    if (typeof window.gtag !== "function") return;
    try { window.gtag("event", name, params || {}); } catch (e) {}
}

function shareableUrl() {
    const cleanPath = window.location.pathname.replace(/index\.html$/, "");
    return new URL(window.location.origin + cleanPath);
}

function smoothScrollTo(id, block) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: block || "start" });
}

// ------- data load ------------------------------------------------

async function loadOccupations() {
    const suffix = currentLang === "en" ? "" : `_${currentLang}`;
    let occRes;
    try {
        occRes = await fetch(`${DATA_BASE}/occupations${suffix}.json`, { cache: "force-cache" });
        if (!occRes.ok) throw new Error("fallback");
    } catch {
        occRes = await fetch(`${DATA_BASE}/occupations.json`, { cache: "force-cache" });
    }
    const metaRes = await fetch(`${DATA_BASE}/meta.json`, { cache: "force-cache" });
    state.occupations = await occRes.json();
    state.meta = await metaRes.json();

    // For non-English locales, also load English titles for bilingual search
    if (currentLang !== "en") {
        try {
            const enRes = await fetch(`${DATA_BASE}/occupations.json`, { cache: "force-cache" });
            const enData = await enRes.json();
            const enMap = {};
            for (const o of enData) enMap[o.soc] = o.title;
            for (const o of state.occupations) {
                o.title_en = enMap[o.soc] || "";
            }
        } catch (e) { /* English fallback not critical */ }
    }
}

function findOccupation(soc) {
    return state.occupations.find(o => o.soc === soc) || null;
}

async function loadTasks() {
    if (state.tasks) return state.tasks;
    if (state.tasksLoading) return state.tasksLoading;
    state.tasksLoading = (async () => {
        const suffix = currentLang === "en" ? "" : `_${currentLang}`;
        let res;
        try {
            res = await fetch(`${DATA_BASE}/tasks${suffix}.json`, { cache: "force-cache" });
            if (!res.ok) throw new Error("fallback");
        } catch {
            res = await fetch(`${DATA_BASE}/tasks.json`, { cache: "force-cache" });
        }
        state.tasks = await res.json();
        return state.tasks;
    })();
    return state.tasksLoading;
}

// ------- autocomplete --------------------------------------------

function normalize(s) {
    return String(s || "").toLowerCase().trim();
}

function suggestOccupations(query) {
    const q = normalize(query);
    if (!q || !state.occupations) return [];
    const matches = [];
    for (const o of state.occupations) {
        const title = normalize(o.title);
        const titleEn = normalize(o.title_en || "");
        const hitLocal = title.includes(q);
        const hitEn = titleEn.includes(q);
        if (hitLocal || hitEn) {
            // rank: starts-with > contains
            const starts = title.startsWith(q) || titleEn.startsWith(q);
            matches.push({ occ: o, rank: starts ? 0 : 1 });
        }
        if (matches.length >= 30) break;
    }
    matches.sort((a, b) => a.rank - b.rank);
    return matches.slice(0, 8).map(m => m.occ);
}

function renderSuggestions(items) {
    const ul = document.getElementById("job-suggestions");
    if (!ul) return;
    if (!items.length) { ul.hidden = true; ul.innerHTML = ""; return; }
    ul.innerHTML = items.map(o =>
        `<li data-soc="${escapeHtml(o.soc)}">${escapeHtml(o.title)}</li>`
    ).join("");
    ul.hidden = false;
}

function hideSuggestions() {
    const ul = document.getElementById("job-suggestions");
    if (ul) { ul.hidden = true; ul.innerHTML = ""; }
}

function onJobInput(e) {
    const items = suggestOccupations(e.target.value);
    renderSuggestions(items);
}

function onJobInputFocus(e) {
    if (e.target.value) onJobInput(e);
}

function onSuggestionClick(e) {
    const li = e.target.closest("li[data-soc]");
    if (!li) return;
    const soc = li.dataset.soc;
    const occ = findOccupation(soc);
    if (!occ) return;
    document.getElementById("job-input").value = occ.title;
    state.selected.soc = soc;
    state.selected.onet_soc = occ.onet_soc;
    hideSuggestions();
}

// ------- age cohort ----------------------------------------------

function setAge(cohort) {
    if (!AGE_COHORTS.includes(cohort)) return;
    state.selected.age = cohort;
    document.querySelectorAll(".age-btn").forEach(b => {
        b.classList.toggle("selected", b.dataset.age === cohort);
    });
}

function onAgeClick(e) {
    const btn = e.target.closest(".age-btn");
    if (!btn) return;
    setAge(btn.dataset.age);
}

// ------- form submit / result -----------------------------------

function resolveOccupation(raw) {
    // If state.selected.soc already chosen from suggestion list, use it.
    if (state.selected.soc) return findOccupation(state.selected.soc);
    // Otherwise try exact (case-insensitive) match on local or English title.
    const q = normalize(raw);
    if (!q) return null;
    const exact = state.occupations.find(o =>
        normalize(o.title) === q || normalize(o.title_en || "") === q
    );
    if (exact) return exact;
    // Fall back to first suggestion (best partial match).
    const sugg = suggestOccupations(raw);
    return sugg[0] || null;
}

function onFormSubmit(e) {
    e.preventDefault();
    const raw = document.getElementById("job-input").value.trim();
    if (!state.selected.age) { alert(t("msg_pick_age")); return; }
    const occ = resolveOccupation(raw);
    if (!occ) { alert(t("msg_no_match")); return; }

    state.selected.soc = occ.soc;
    state.selected.onet_soc = occ.onet_soc;
    document.getElementById("job-input").value = occ.title;

    trackEvent("dashboard_view", {
        soc: occ.soc, age: state.selected.age, language: currentLang, source: "fresh"
    });

    pushUrl();
    renderDashboard();
}

function pushUrl() {
    const url = shareableUrl();
    url.searchParams.set("soc", state.selected.soc);
    url.searchParams.set("age", state.selected.age);
    history.replaceState(null, "", url);
}

function setPhase(phase) {
    const input = document.getElementById("input-section");
    const result = document.getElementById("result-section");
    const adInput = document.querySelector(".ad-slot-input");
    if (phase === "input") {
        input.classList.remove("hidden");
        result.classList.add("hidden");
        if (adInput) adInput.classList.remove("hidden");
        document.body.classList.remove("phase-result");
    } else if (phase === "result") {
        input.classList.add("hidden");
        result.classList.remove("hidden");
        if (adInput) adInput.classList.add("hidden");
        document.body.classList.add("phase-result");
    }
}

function renderDashboard() {
    const occ = findOccupation(state.selected.soc);
    if (!occ) return;

    document.getElementById("result-job-name").textContent = occ.title;
    document.getElementById("result-age-name").textContent = t(`age_${state.selected.age}`);

    renderTaskHeatmap(occ.soc);
    renderCohortReality(occ);

    setPhase("result");
    smoothScrollTo("result-section", "start");
}

function renderPanelPlaceholder(panelId, titleKey, subtitleKey) {
    const el = document.getElementById(panelId);
    if (!el) return;
    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t(titleKey))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t(subtitleKey))}</p>
        <p class="dashboard-panel-empty">${escapeHtml(t("panel_coming_soon"))}</p>
    `;
}

// Order tasks for display: high-exposure first (T1, T2), then T3/T4, then
// safe (T0) last. Within each bucket, Core tasks first. This puts the
// "things to pay attention to" up top without hiding the safe ones —
// clinical guidance: specificity over magnitude.
const TASK_DISPLAY_ORDER = ["T1", "T2", "T3", "T4", "T0"];

function sortTasksForDisplay(tasks) {
    return [...tasks].sort((a, b) => {
        const da = TASK_DISPLAY_ORDER.indexOf(a.gpt4);
        const db = TASK_DISPLAY_ORDER.indexOf(b.gpt4);
        if (da !== db) return da - db;
        // Core before Supplemental within same label
        const ca = a.type === "Core" ? 0 : 1;
        const cb = b.type === "Core" ? 0 : 1;
        return ca - cb;
    });
}

function computeExposureDist(tasks) {
    const dist = { T0: 0, T1: 0, T2: 0, T3: 0, T4: 0 };
    for (const t of tasks) {
        if (dist[t.gpt4] !== undefined) dist[t.gpt4]++;
    }
    return dist;
}

function taskLabel(task) {
    return TASK_LABELS.includes(task.gpt4) ? task.gpt4 : "T4";
}

function buildDonutSVG(dist, total) {
    const colors = { T0: '#5cb85c', T1: '#d9534f', T2: '#f0ad4e', T3: '#5bc0de', T4: '#999' };
    const r = 42, cx = 60, cy = 60, sw = 13;
    const C = 2 * Math.PI * r;

    let offset = 0;
    let arcs = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eee" stroke-width="${sw}"/>`;

    for (const label of TASK_LABELS) {
        const n = dist[label] || 0;
        if (!n) continue;
        const len = (n / total) * C;
        arcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ` +
            `stroke="${colors[label]}" stroke-width="${sw}" ` +
            `stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" ` +
            `stroke-dashoffset="${(-offset).toFixed(2)}" ` +
            `stroke-linecap="round" ` +
            `transform="rotate(-90 ${cx} ${cy})"/>`;
        offset += len;
    }

    const exposed = (dist.T1 || 0) + (dist.T2 || 0) + (dist.T3 || 0);
    const pct = Math.round(exposed / total * 100);

    return `<svg viewBox="0 0 120 120" class="exposure-donut">` +
        arcs +
        `<text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="central" class="donut-pct">${pct}%</text>` +
        `</svg>`;
}

async function renderTaskHeatmap(soc) {
    const el = document.getElementById("panel-task-heatmap");
    if (!el) return;

    // Loading placeholder so the layout doesn't jump.
    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t("panel_task_title"))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t("panel_task_subtitle"))}</p>
        <p class="dashboard-panel-empty">…</p>
    `;

    let tasks;
    try {
        const all = await loadTasks();
        tasks = all[soc] || [];
    } catch (e) {
        console.error("tasks load failed", e);
        el.querySelector(".dashboard-panel-empty").textContent = t("panel_coming_soon");
        return;
    }
    if (!tasks.length) {
        el.querySelector(".dashboard-panel-empty").textContent = t("panel_coming_soon");
        return;
    }

    const sorted = sortTasksForDisplay(tasks);
    const dist = computeExposureDist(tasks);
    const total = tasks.length;
    const summary = t("task_summary").replace("{n}", total);

    const segments = TASK_LABELS.map(label => {
        const n = dist[label] || 0;
        if (!n) return "";
        const pct = (n / total * 100).toFixed(1);
        return `<span class="task-bar-seg task-bar-${label}" style="width:${pct}%" title="${label}: ${n}"></span>`;
    }).join("");

    const legendChips = TASK_LABELS.map(label =>
        `<span class="task-legend-chip task-legend-${label}" title="${escapeHtml(t("legend_" + label + "_desc"))}">` +
        `<i></i>${escapeHtml(t("legend_" + label))}` +
        `</span>`
    ).join("");

    const rowsHtml = sorted.map((task, idx) => {
        const label = taskLabel(task);
        const typeLabel = task.type === "Core" ? t("task_type_core") : t("task_type_supplemental");
        const hiddenAttr = idx >= TASKS_VISIBLE_INITIAL ? ' data-hidden="1"' : "";
        return `
            <div class="task-row task-row-${label}" data-type="${escapeHtml(task.type)}"${hiddenAttr}>
                <span class="task-chip task-chip-${label}">${label}</span>
                <p class="task-text">${escapeHtml(task.task)}</p>
                <span class="task-type">${escapeHtml(typeLabel)}</span>
            </div>
        `;
    }).join("");

    const hasMore = total > TASKS_VISIBLE_INITIAL;
    const showMoreBtn = hasMore
        ? `<button type="button" class="task-show-more" data-expanded="0">${escapeHtml(t("task_show_more"))} (${total - TASKS_VISIBLE_INITIAL})</button>`
        : "";

    const donutSvg = buildDonutSVG(dist, total);
    const TASK_COLORS = { T0: '#5cb85c', T1: '#d9534f', T2: '#f0ad4e', T3: '#5bc0de', T4: '#999' };
    const breakdownRows = TASK_LABELS.map(label => {
        const n = dist[label] || 0;
        if (!n) return '';
        const pct = Math.round(n / total * 100);
        return `<div class="breakdown-row">
            <span class="breakdown-dot" style="background:${TASK_COLORS[label]}"></span>
            <span class="breakdown-label">${escapeHtml(t("legend_" + label))}</span>
            <span class="breakdown-count">${n}</span>
            <span class="breakdown-bar-wrap">
                <span class="breakdown-bar-fill" style="width:${pct}%;background:${TASK_COLORS[label]}"></span>
            </span>
        </div>`;
    }).join('');

    const exposed = (dist.T1 || 0) + (dist.T2 || 0) + (dist.T3 || 0);
    const exposedPct = Math.round(exposed / total * 100);
    const verdictKey = exposedPct >= 60 ? "verdict_high" : exposedPct >= 30 ? "verdict_mid" : "verdict_low";
    const verdictClass = exposedPct >= 60 ? "verdict-high" : exposedPct >= 30 ? "verdict-mid" : "verdict-low";

    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t("panel_task_title"))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t("panel_task_subtitle"))}</p>
        <p class="task-summary">${escapeHtml(summary)}</p>
        <div class="exposure-overview">
            ${donutSvg}
            <div class="exposure-breakdown">${breakdownRows}</div>
        </div>
        <p class="verdict ${verdictClass}">${escapeHtml(t(verdictKey))}</p>
        <div class="task-bar">${segments}</div>
        <div class="task-legend">${legendChips}</div>
        <div class="task-list">${rowsHtml}</div>
        ${showMoreBtn}
    `;

    const btn = el.querySelector(".task-show-more");
    if (btn) btn.addEventListener("click", () => toggleTaskList(el, btn, total));
}

function toggleTaskList(panelEl, btn, total) {
    const nowExpanded = !panelEl.classList.contains("tasks-expanded");
    panelEl.classList.toggle("tasks-expanded", nowExpanded);
    btn.dataset.expanded = nowExpanded ? "1" : "0";
    btn.textContent = nowExpanded
        ? t("task_show_less")
        : `${t("task_show_more")} (${total - TASKS_VISIBLE_INITIAL})`;
}

// Reality Check sources — author label is locale-independent (proper nouns).
const REALITY_SOURCES = [
    { label: "Bessen 2015 · SSRN",       url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2690435" },
    { label: "Arntz et al. 2016 · OECD", url: "https://doi.org/10.1787/5jlz9h56dvq7-en" },
    { label: "Autor 2024 · NBER w31866", url: "https://www.nber.org/papers/w31866" },
    { label: "Acemoglu 2024 · NBER w32487", url: "https://www.nber.org/papers/w32487" }
];

function computeExposurePercentile(occ, all) {
    // Rank by exp_gamma desc: rank 1 = most exposed, rank N = least.
    // Returns the top-X percentile (1..100), where smaller means more exposed.
    if (!occ || typeof occ.exp_gamma !== "number") return null;
    const valid = all.filter(o => typeof o.exp_gamma === "number");
    valid.sort((a, b) => b.exp_gamma - a.exp_gamma);
    const idx = valid.findIndex(o => o.soc === occ.soc);
    if (idx < 0) return null;
    return Math.max(1, Math.round(((idx + 1) / valid.length) * 100));
}

function renderCohortReality(occ) {
    const el = document.getElementById("panel-cohort-reality");
    if (!el) return;

    const pct = computeExposurePercentile(occ, state.occupations);
    const markerLeft = pct !== null ? 100 - pct : 50;  // top 32% → marker at 68%
    const pctText = pct !== null
        ? t("cohort_percentile").replace("{p}", pct)
        : "";

    const realityCards = REALITY_SOURCES.map((src, i) => {
        const headKey = `reality_card_${i + 1}_head`;
        const bodyKey = `reality_card_${i + 1}_body`;
        return `
            <div class="reality-card">
                <h4>${escapeHtml(t(headKey))}</h4>
                <p>${escapeHtml(t(bodyKey))}</p>
                <a href="${escapeHtml(src.url)}" target="_blank" rel="noopener">${escapeHtml(src.label)} →</a>
            </div>
        `;
    }).join("");

    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t("cohort_position_title"))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t("cohort_position_subtitle"))}</p>

        <div class="cohort-axis">
            <span>${escapeHtml(t("cohort_axis_left"))}</span>
            <span>${escapeHtml(t("cohort_axis_right"))}</span>
        </div>
        <div class="cohort-strip">
            <div class="cohort-marker" style="left:${markerLeft.toFixed(1)}%"></div>
        </div>
        <p class="cohort-percentile">${escapeHtml(pctText)}</p>

        <h4 class="reality-check-title">${escapeHtml(t("reality_check_title"))}</h4>
        <p class="reality-check-intro">${escapeHtml(t("reality_check_intro"))}</p>
        <div class="reality-grid">${realityCards}</div>
    `;
}

// ------- URL hydration (?soc=&age=) ------------------------------

function hydrateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const soc = params.get("soc");
    const age = params.get("age");
    if (!soc || !age) return;
    const occ = findOccupation(soc);
    if (!occ || !AGE_COHORTS.includes(age)) return;

    state.selected.soc = occ.soc;
    state.selected.onet_soc = occ.onet_soc;
    state.selected.age = age;

    document.getElementById("job-input").value = occ.title;
    setAge(age);
    trackEvent("dashboard_view", {
        soc: occ.soc, age, language: currentLang, source: "deeplink"
    });
    renderDashboard();
}

// ------- restart / share / lang switcher -------------------------

function restartFlow() {
    state.selected.soc = null;
    state.selected.onet_soc = null;
    state.selected.age = null;
    document.getElementById("job-input").value = "";
    document.querySelectorAll(".age-btn").forEach(b => b.classList.remove("selected"));
    history.replaceState(null, "", shareableUrl());
    setPhase("input");
    smoothScrollTo("input-section", "start");
}

async function onShare() {
    if (!state.selected.soc || !state.selected.age) return;
    const url = shareableUrl();
    url.searchParams.set("soc", state.selected.soc);
    url.searchParams.set("age", state.selected.age);
    const shareUrl = url.toString();
    const occ = findOccupation(state.selected.soc);
    const caption = `${t("app_title")} — ${occ ? occ.title : ""}`;

    if (navigator.share) {
        try {
            await navigator.share({ title: t("app_title"), text: caption, url: shareUrl });
            trackEvent("share_click", {
                soc: state.selected.soc, age: state.selected.age, language: currentLang, method: "native"
            });
            return;
        } catch (e) { /* user canceled */ }
    }
    const clipboardText = caption + "\n\n" + shareUrl;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(clipboardText);
        } else {
            const ta = document.createElement("textarea");
            ta.value = clipboardText;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        alert(t("msg_share_done"));
        trackEvent("share_click", {
            soc: state.selected.soc, age: state.selected.age, language: currentLang, method: "clipboard"
        });
    } catch (e) {
        console.error("share failed", e);
    }
}

function setupLangSwitch() {
    const sw = document.getElementById("lang-switch");
    if (!sw) return;
    const btn = sw.querySelector(".lang-toggle");
    const menu = sw.querySelector(".lang-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", () => {
        const open = menu.hidden;
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
        if (!sw.contains(e.target)) {
            menu.hidden = true;
            btn.setAttribute("aria-expanded", "false");
        }
    });
}

// ------- random placeholder cycle ---------------------------------

let placeholderTimer = null;

function startPlaceholderCycle() {
    const input = document.getElementById("job-input");
    if (!input || !state.occupations || !state.occupations.length) return;

    function pick3() {
        const pool = state.occupations;
        const idxs = new Set();
        while (idxs.size < Math.min(3, pool.length)) {
            idxs.add(Math.floor(Math.random() * pool.length));
        }
        return [...idxs].map(i => pool[i].title);
    }

    function refresh() {
        input.placeholder = pick3().join(", ") + "…";
    }

    refresh();
    placeholderTimer = setInterval(refresh, 5000);
}

// ------- bootstrap ------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
    currentLang = (document.documentElement.lang || "ko").toLowerCase();
    if (!UI_TEXT[currentLang]) currentLang = "en";
    state.lang = currentLang;
    applyI18n();
    setupLangSwitch();

    try {
        await loadOccupations();
    } catch (e) {
        console.error("data load failed", e);
        return;
    }

    startPlaceholderCycle();

    document.getElementById("job-form").addEventListener("submit", onFormSubmit);
    const input = document.getElementById("job-input");
    input.addEventListener("input", onJobInput);
    input.addEventListener("focus", onJobInputFocus);
    input.addEventListener("input", () => { state.selected.soc = null; });
    document.getElementById("job-suggestions").addEventListener("mousedown", onSuggestionClick);
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#job-input,#job-suggestions")) hideSuggestions();
    });

    document.getElementById("age-group").addEventListener("click", onAgeClick);

    document.getElementById("btn-share").addEventListener("click", onShare);
    document.getElementById("btn-restart").addEventListener("click", restartFlow);

    // Collapse empty ad slots after a delay (no ads on localhost/dev)
    setTimeout(() => {
        document.querySelectorAll('.ad-slot').forEach(slot => {
            if (!slot.querySelector('iframe')) {
                slot.style.display = 'none';
            }
        });
    }, 3000);

    hydrateFromUrl();
});
