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
        hint: "현재 v1은 영어 직업명만 검색돼요. 한국어 직업명 검색은 v1.1에서 추가될 예정이에요.",
        btn_see_dashboard: "내 대시보드 보기",
        btn_share: "결과 공유하기",
        btn_restart: "다른 직업으로 다시 하기",
        result_job_label: "직업",
        result_age_label: "연령대",
        result_subtitle: "메이저 보고서가 평균값으로만 보여주는 정보를 당신의 좌표로 분해했어요.",
        panel_task_title: "Task별 AI 노출",
        panel_task_subtitle: "당신 직무의 task를 분해하고 각각의 AI 영향을 표시해요.",
        panel_cohort_title: "코호트 + Reality Check",
        panel_cohort_subtitle: "당신과 비슷한 사람들의 위치 + 두려움을 줄이는 객관 데이터.",
        panel_coming_soon: "곧 추가될 패널이에요.",
        task_summary: "이 직업의 task {n}개 중 AI 노출 분포",
        task_show_more: "더 보기",
        task_show_less: "접기",
        task_type_core: "핵심",
        task_type_supplemental: "보조",
        legend_T0: "안전",
        legend_T1: "직접 노출",
        legend_T2: "LLM+도구",
        legend_T3: "이미지 영역",
        legend_T4: "부분/불확실",
        legend_T0_desc: "AI가 50% 이상 시간을 단축할 수 없어요.",
        legend_T1_desc: "LLM 단독으로 50%+ 단축 가능.",
        legend_T2_desc: "LLM + 도구/인터페이스 결합 시 50%+ 단축.",
        legend_T3_desc: "이미지 생성 등 특수 영역.",
        legend_T4_desc: "부분 노출 또는 불확실해요.",
        cohort_position_title: "200개 직업 중 당신의 위치",
        cohort_position_subtitle: "GPT-4 노출 점수로 본 분포",
        cohort_percentile: "당신 직업은 노출 상위 {p}%에 있어요",
        cohort_axis_left: "← 안전",
        cohort_axis_right: "노출 큼 →",
        reality_check_title: "Reality Check",
        reality_check_intro: "메이저 doom 보도가 자주 빠뜨리는 4가지 객관 데이터.",
        reality_card_1_head: "과거 자동화 예측은 자주 빗나가요",
        reality_card_1_body: "ATM 도입 후 미국 뱅크텔러는 1980 50만 → 2010 60만으로 늘었어요. 지점이 싸져 더 많이 만들어졌어요.",
        reality_card_2_head: "같은 데이터, 다른 결론",
        reality_card_2_body: "Frey-Osborne 2013은 미국 직업 47%가 '고위험'이라 했지만, OECD 2016 재추정은 9%. 실제 2013-23 실업률은 평균 4%대였어요.",
        reality_card_3_head: "새 직업이 만들어져요",
        reality_card_3_body: "Autor 2024 분석: 2018년 미국 고용의 60%는 1940년에 없던 직업이에요. 자동화는 새 직업도 만들어요.",
        reality_card_4_head: "노출 ≠ 대체",
        reality_card_4_body: "Acemoglu 2024 추정: 향후 10년 AI 영향은 GDP +0.5–0.9%. '대량 실업' 시나리오는 아니에요.",
        accuracy_notice: "v1 데이터는 US BLS/O*NET 기준이에요. 한국 노동시장과 차이가 있을 수 있어요.",
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
        hint: "Type your occupation in English. v1.1 will add native job-name search.",
        btn_see_dashboard: "See my dashboard",
        btn_share: "Share my dashboard",
        btn_restart: "Try another job",
        result_job_label: "Job",
        result_age_label: "Age",
        result_subtitle: "We broke the WEF/OECD averages into your personal coordinates.",
        panel_task_title: "Task-level AI exposure",
        panel_task_subtitle: "Your job decomposed into tasks, each scored for AI impact.",
        panel_cohort_title: "Cohort + Reality Check",
        panel_cohort_subtitle: "Where peers like you stand + grounded counter-evidence.",
        panel_coming_soon: "Panel coming in the next release.",
        task_summary: "AI exposure across {n} tasks in this job",
        task_show_more: "Show more",
        task_show_less: "Show less",
        task_type_core: "Core",
        task_type_supplemental: "Supplemental",
        legend_T0: "Safe",
        legend_T1: "High exposure",
        legend_T2: "LLM + tools",
        legend_T3: "Image domain",
        legend_T4: "Partial / uncertain",
        legend_T0_desc: "AI offers no significant time savings (<50%).",
        legend_T1_desc: "An LLM alone can save 50%+ time.",
        legend_T2_desc: "LLM with tools/interfaces saves 50%+.",
        legend_T3_desc: "Image generation or specialty domain.",
        legend_T4_desc: "Partial exposure or uncertain.",
        cohort_position_title: "Your position among 200 occupations",
        cohort_position_subtitle: "Distribution by GPT-4 exposure score",
        cohort_percentile: "Your job is in the top {p}% by exposure",
        cohort_axis_left: "← Safer",
        cohort_axis_right: "More exposed →",
        reality_check_title: "Reality Check",
        reality_check_intro: "4 objective data points major AI-doom coverage often skips.",
        reality_card_1_head: "Past automation predictions often miss",
        reality_card_1_body: "After ATMs, US bank tellers grew from 500k (1980) to 600k (2010). Cheaper branches meant more branches were opened.",
        reality_card_2_head: "Same data, different conclusions",
        reality_card_2_body: "Frey-Osborne 2013 said 47% of US jobs were 'high-risk.' OECD 2016 re-estimated 9%. Actual 2013-23 unemployment averaged ~4%.",
        reality_card_3_head: "New jobs are created",
        reality_card_3_body: "Autor 2024: 60% of 2018 US employment is in occupations that didn't exist in 1940. Automation also creates jobs.",
        reality_card_4_head: "Exposure ≠ replacement",
        reality_card_4_body: "Acemoglu 2024: AI's labor-market impact over 10 years is ~+0.5–0.9% GDP. Not a 'mass unemployment' scenario.",
        accuracy_notice: "v1 data is US (BLS/O*NET). Local market may differ.",
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
        hint: "現在 v1 は英語の職業名のみ検索可能。日本語職業名検索は v1.1 で対応予定。",
        btn_see_dashboard: "ダッシュボードを見る",
        btn_share: "結果をシェア",
        btn_restart: "別の職業で試す",
        result_job_label: "職業",
        result_age_label: "年齢層",
        result_subtitle: "WEF/OECDの平均値を、あなたの座標に分解しました。",
        panel_task_title: "タスク別 AI 影響度",
        panel_task_subtitle: "あなたの職業をタスクに分解し、それぞれのAI影響を表示。",
        panel_cohort_title: "コホート + Reality Check",
        panel_cohort_subtitle: "近いプロフィールの人の位置 + 過剰な不安を抑える客観データ。",
        panel_coming_soon: "近日追加予定のパネルです。",
        task_summary: "この職業の{n}個のタスクのAI影響度分布",
        task_show_more: "もっと見る",
        task_show_less: "閉じる",
        task_type_core: "コア",
        task_type_supplemental: "補助",
        legend_T0: "安全",
        legend_T1: "直接影響",
        legend_T2: "LLM+ツール",
        legend_T3: "画像領域",
        legend_T4: "部分/不確実",
        legend_T0_desc: "AIによる時間短縮は50%未満。",
        legend_T1_desc: "LLM単独で50%以上短縮可能。",
        legend_T2_desc: "LLM + ツール/UIで50%以上短縮。",
        legend_T3_desc: "画像生成など特殊領域。",
        legend_T4_desc: "部分的または不確実。",
        cohort_position_title: "200職業における、あなたの位置",
        cohort_position_subtitle: "GPT-4 影響度スコアでの分布",
        cohort_percentile: "あなたの職業は影響度の上位 {p}% にあります",
        cohort_axis_left: "← 安全",
        cohort_axis_right: "影響大 →",
        reality_check_title: "Reality Check",
        reality_check_intro: "メジャーな AI 不安報道がよく省く 4 つの客観データ。",
        reality_card_1_head: "過去の自動化予測はしばしば外れる",
        reality_card_1_body: "ATM 導入後、米国の銀行窓口係は 1980 年 50 万人 → 2010 年 60 万人に増加。支店コストが下がり、店舗数が増えたためです。",
        reality_card_2_head: "同じデータ、異なる結論",
        reality_card_2_body: "Frey-Osborne 2013 は米国職業の 47% が「高リスク」と予測。OECD 2016 の再推計は 9%。実際 2013-23 の失業率は平均約 4%。",
        reality_card_3_head: "新しい職業が生まれている",
        reality_card_3_body: "Autor 2024：2018 年の米国雇用の 60% は 1940 年に存在しなかった職業。自動化は新しい職業も作る。",
        reality_card_4_head: "影響 ≠ 代替",
        reality_card_4_body: "Acemoglu 2024 推計：今後 10 年の AI 労働市場への影響は GDP 比 +0.5–0.9%。「大量失業」シナリオではない。",
        accuracy_notice: "v1 データは米国 BLS/O*NET ベース。日本市場とは差があります。",
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
        hint: "v1 目前僅支援英文職業名搜尋。中文職業名搜尋將於 v1.1 加入。",
        btn_see_dashboard: "看我的儀表板",
        btn_share: "分享結果",
        btn_restart: "換個職業再試",
        result_job_label: "職業",
        result_age_label: "年齡層",
        result_subtitle: "把 WEF/OECD 的平均值，拆解成你的座標。",
        panel_task_title: "Task 級 AI 暴露度",
        panel_task_subtitle: "把你的職業拆成 task，逐個標出 AI 影響。",
        panel_cohort_title: "同代人 + Reality Check",
        panel_cohort_subtitle: "與你相近的人在哪 + 緩解過度恐懼的客觀數據。",
        panel_coming_soon: "下個版本即將加入。",
        task_summary: "此職業 {n} 個 task 的 AI 影響分布",
        task_show_more: "看更多",
        task_show_less: "收起",
        task_type_core: "核心",
        task_type_supplemental: "輔助",
        legend_T0: "安全",
        legend_T1: "直接暴露",
        legend_T2: "LLM + 工具",
        legend_T3: "影像領域",
        legend_T4: "部分/不確定",
        legend_T0_desc: "AI 無法縮短 50% 以上時間。",
        legend_T1_desc: "LLM 單獨可縮短 50% 以上時間。",
        legend_T2_desc: "LLM 配合工具/介面可縮短 50% 以上。",
        legend_T3_desc: "影像生成等特殊領域。",
        legend_T4_desc: "部分暴露或不確定。",
        cohort_position_title: "200 個職業中你的位置",
        cohort_position_subtitle: "依 GPT-4 暴露分數的分布",
        cohort_percentile: "你的職業在暴露度前 {p}%",
        cohort_axis_left: "← 安全",
        cohort_axis_right: "暴露大 →",
        reality_check_title: "Reality Check",
        reality_check_intro: "主流 AI 末日報導常忽略的 4 個客觀數據。",
        reality_card_1_head: "過去的自動化預測常常落空",
        reality_card_1_body: "ATM 普及後，美國銀行櫃員從 1980 的 50 萬增加到 2010 的 60 萬。分行成本下降，反而開了更多分行。",
        reality_card_2_head: "同樣資料，不同結論",
        reality_card_2_body: "Frey-Osborne 2013 說美國 47% 工作「高風險」。OECD 2016 重新估算為 9%。實際 2013-23 失業率平均約 4%。",
        reality_card_3_head: "新工作正在誕生",
        reality_card_3_body: "Autor 2024 分析：2018 美國 60% 的就業在 1940 年並不存在。自動化也創造新工作。",
        reality_card_4_head: "暴露 ≠ 取代",
        reality_card_4_body: "Acemoglu 2024 估計：未來 10 年 AI 對勞動市場影響約 GDP +0.5–0.9%，非「大規模失業」場景。",
        accuracy_notice: "v1 數據以美國 BLS/O*NET 為準。台灣市場可能有差。",
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
        hint: "v1 solo busca nombres en inglés. La búsqueda en español llegará en v1.1.",
        btn_see_dashboard: "Ver mi panel",
        btn_share: "Compartir mi panel",
        btn_restart: "Probar otra profesión",
        result_job_label: "Profesión",
        result_age_label: "Edad",
        result_subtitle: "Descompusimos los promedios de WEF/OECD en tus coordenadas personales.",
        panel_task_title: "Exposición a IA por tarea",
        panel_task_subtitle: "Tu profesión descompuesta en tareas, cada una con su impacto IA.",
        panel_cohort_title: "Cohorte + Reality Check",
        panel_cohort_subtitle: "Dónde están personas como tú + evidencia que reduce el miedo.",
        panel_coming_soon: "Panel próximamente.",
        task_summary: "Exposición a IA en las {n} tareas de esta profesión",
        task_show_more: "Ver más",
        task_show_less: "Ver menos",
        task_type_core: "Esencial",
        task_type_supplemental: "Suplementario",
        legend_T0: "Seguro",
        legend_T1: "Alta exposición",
        legend_T2: "LLM + herramientas",
        legend_T3: "Dominio de imagen",
        legend_T4: "Parcial / incierto",
        legend_T0_desc: "La IA no ahorra >50% del tiempo.",
        legend_T1_desc: "Un LLM solo ahorra 50%+ tiempo.",
        legend_T2_desc: "LLM con herramientas ahorra 50%+.",
        legend_T3_desc: "Generación de imágenes u otros dominios específicos.",
        legend_T4_desc: "Exposición parcial o incierta.",
        cohort_position_title: "Tu posición entre 200 ocupaciones",
        cohort_position_subtitle: "Distribución según exposición a GPT-4",
        cohort_percentile: "Tu profesión está en el top {p}% de exposición",
        cohort_axis_left: "← Más seguro",
        cohort_axis_right: "Más expuesto →",
        reality_check_title: "Reality Check",
        reality_check_intro: "4 datos objetivos que la cobertura mediática del 'doom' suele omitir.",
        reality_card_1_head: "Las predicciones de automatización suelen fallar",
        reality_card_1_body: "Tras los cajeros automáticos, los cajeros bancarios en EE. UU. crecieron de 500k (1980) a 600k (2010). Sucursales más baratas significan más sucursales.",
        reality_card_2_head: "Mismos datos, distintas conclusiones",
        reality_card_2_body: "Frey-Osborne 2013 estimó 47% de empleos en 'alto riesgo'. La OCDE en 2016 lo reestimó en 9%. El desempleo real 2013-23 promedió ~4%.",
        reality_card_3_head: "Se crean nuevos empleos",
        reality_card_3_body: "Autor 2024: el 60% del empleo de EE. UU. en 2018 está en ocupaciones que no existían en 1940. La automatización también crea empleos.",
        reality_card_4_head: "Exposición ≠ reemplazo",
        reality_card_4_body: "Acemoglu 2024: el impacto laboral de la IA en 10 años es ~+0,5–0,9% del PIB. No es un escenario de 'desempleo masivo'.",
        accuracy_notice: "Datos v1 = US (BLS/O*NET). Tu mercado local puede diferir.",
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
        hint: "v1 sucht nur englische Berufsbezeichnungen. Deutsche Suche kommt in v1.1.",
        btn_see_dashboard: "Mein Dashboard zeigen",
        btn_share: "Dashboard teilen",
        btn_restart: "Anderen Beruf testen",
        result_job_label: "Beruf",
        result_age_label: "Alter",
        result_subtitle: "Wir haben die WEF/OECD-Durchschnitte in deine Koordinaten zerlegt.",
        panel_task_title: "KI-Exposition pro Task",
        panel_task_subtitle: "Dein Beruf in Tasks zerlegt, jeweils mit KI-Impact.",
        panel_cohort_title: "Kohorte + Reality Check",
        panel_cohort_subtitle: "Wo Leute wie du stehen + Evidenz, die Angst dämpft.",
        panel_coming_soon: "Panel folgt im nächsten Release.",
        task_summary: "KI-Exposition über {n} Aufgaben in diesem Beruf",
        task_show_more: "Mehr anzeigen",
        task_show_less: "Ausblenden",
        task_type_core: "Kern",
        task_type_supplemental: "Ergänzend",
        legend_T0: "Sicher",
        legend_T1: "Hoch exponiert",
        legend_T2: "LLM + Tools",
        legend_T3: "Bildbereich",
        legend_T4: "Teilweise / unsicher",
        legend_T0_desc: "KI spart keine >50% Zeit.",
        legend_T1_desc: "LLM allein spart 50%+ Zeit.",
        legend_T2_desc: "LLM mit Tools spart 50%+.",
        legend_T3_desc: "Bildgenerierung oder Spezialbereich.",
        legend_T4_desc: "Teilweise oder unsicher.",
        cohort_position_title: "Deine Position unter 200 Berufen",
        cohort_position_subtitle: "Verteilung nach GPT-4-Expositionsscore",
        cohort_percentile: "Dein Beruf liegt in den obersten {p}% der Exposition",
        cohort_axis_left: "← Sicherer",
        cohort_axis_right: "Stärker exponiert →",
        reality_check_title: "Reality Check",
        reality_check_intro: "4 objektive Datenpunkte, die in der KI-Doom-Berichterstattung oft fehlen.",
        reality_card_1_head: "Automatisierungsprognosen liegen oft daneben",
        reality_card_1_body: "Nach Geldautomaten stieg die Zahl der US-Bankangestellten von 500k (1980) auf 600k (2010). Günstigere Filialen führten zu mehr Filialen.",
        reality_card_2_head: "Gleiche Daten, andere Schlussfolgerungen",
        reality_card_2_body: "Frey-Osborne 2013 sah 47% der US-Jobs als 'hochrisikoreich'. OECD 2016 schätzte 9%. Die Arbeitslosigkeit 2013-23 lag im Schnitt bei ~4%.",
        reality_card_3_head: "Neue Berufe entstehen",
        reality_card_3_body: "Autor 2024: 60% der US-Beschäftigung 2018 entfallen auf Berufe, die es 1940 nicht gab. Automatisierung schafft auch neue Jobs.",
        reality_card_4_head: "Exposition ≠ Ersatz",
        reality_card_4_body: "Acemoglu 2024 schätzt den KI-Arbeitsmarkteffekt über 10 Jahre auf ~+0,5–0,9% BIP. Kein 'Massenarbeitslosigkeit'-Szenario.",
        accuracy_notice: "v1-Daten = US (BLS/O*NET). Lokaler Markt kann abweichen.",
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
    const [occRes, metaRes] = await Promise.all([
        fetch(`${DATA_BASE}/occupations.json`, { cache: "force-cache" }),
        fetch(`${DATA_BASE}/meta.json`, { cache: "force-cache" })
    ]);
    state.occupations = await occRes.json();
    state.meta = await metaRes.json();
}

function findOccupation(soc) {
    return state.occupations.find(o => o.soc === soc) || null;
}

async function loadTasks() {
    if (state.tasks) return state.tasks;
    if (state.tasksLoading) return state.tasksLoading;
    state.tasksLoading = (async () => {
        const res = await fetch(`${DATA_BASE}/tasks.json`, { cache: "force-cache" });
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
        if (title.includes(q)) {
            // rank: starts-with > contains
            matches.push({ occ: o, rank: title.startsWith(q) ? 0 : 1 });
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
    // Otherwise try exact (case-insensitive) match on input value.
    const q = normalize(raw);
    if (!q) return null;
    const exact = state.occupations.find(o => normalize(o.title) === q);
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
    if (phase === "input") {
        input.classList.remove("hidden");
        result.classList.add("hidden");
    } else if (phase === "result") {
        input.classList.add("hidden");
        result.classList.remove("hidden");
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
        `<i></i>${escapeHtml(label)} · ${escapeHtml(t("legend_" + label))}` +
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

    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t("panel_task_title"))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t("panel_task_subtitle"))}</p>
        <p class="task-summary">${escapeHtml(summary)}</p>
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

    hydrateFromUrl();
});
