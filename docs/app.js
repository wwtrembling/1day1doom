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
        hint: "한국어로도, 영어로도 직업명을 검색할 수 있어요.",
        btn_see_dashboard: "내 대시보드 보기",
        btn_share: "결과 공유하기",
        btn_restart: "다른 직업으로 다시 하기",
        result_job_label: "직업",
        result_age_label: "연령대",
        result_subtitle: "뉴스가 '평균'으로만 말하던 걸, 당신 직업 하나에 맞춰 풀어봤어요.",
        panel_task_title: "내 일 중 AI가 대신할 수 있는 부분",
        panel_task_subtitle: "당신이 하는 일을 작은 단위로 쪼갠 뒤, 각각을 AI가 얼마나 거들 수 있는지 표시했어요.",
        panel_cohort_title: "비슷한 사람들과 비교 + 팩트 체크",
        panel_cohort_subtitle: "비슷한 처지의 사람들은 어디쯤 있는지, 그리고 막연한 불안을 덜어줄 사실들.",
        panel_coming_soon: "곧 추가될 내용이에요.",
        task_summary: "이 직업이 하는 일 {n}가지를 AI가 얼마나 거들 수 있는지",
        donut_sub: "AI 가속",
        task_interpretation: "이 일을 {total}가지로 나눠 보면, 그중 {exposed}가지는 AI를 잘 쓰면 눈에 띄게 빨라질 수 있어요. 나머지는 아직 사람 손이 더 필요한 일이고요.",
        task_reassurance: "단, '빨라진다'가 곧 '사라진다'는 아니에요. 대개는 같은 사람이 같은 시간에 더 많은 일을 해내게 됩니다.",
        task_show_more: "더 보기",
        task_show_less: "접기",
        task_type_core: "핵심",
        task_type_supplemental: "보조",
        legend_T0: "안전",
        legend_T1: "AI가 바로 대신함",
        legend_T2: "AI + 도구면 가능",
        legend_T3: "그림·영상 작업",
        legend_T4: "일부만 / 아직 불확실",
        legend_T0_desc: "AI를 써도 일하는 시간이 크게 줄지 않아요.",
        legend_T1_desc: "AI 혼자서도 일하는 시간을 절반 넘게 줄일 수 있어요.",
        legend_T2_desc: "AI에 도구를 붙이면 시간을 절반 넘게 줄일 수 있어요.",
        legend_T3_desc: "그림 생성처럼 특수한 작업이에요.",
        legend_T4_desc: "일부만 영향을 받거나, 아직 판단하기 일러요.",
        cohort_position_title: "200개 직업 중 내 자리",
        cohort_position_subtitle: "AI가 대신하기 쉬운 정도로 줄 세워 봤어요",
        cohort_percentile: "당신 직업은 AI 영향이 큰 쪽에서 상위 {p}%예요",
        cohort_axis_left: "← 영향 적음",
        cohort_axis_right: "영향 큼 →",
        reality_check_title: "그래도, 팩트 체크",
        reality_check_intro: "무서운 뉴스가 자주 빼놓는 4가지 사실.",
        reality_card_1_head: "과거 자동화 예측은 자주 빗나가요",
        reality_card_1_body: "ATM 도입 후 미국 뱅크텔러는 1980 50만 → 2010 60만으로 늘었어요. 지점이 싸져 더 많이 만들어졌어요.",
        reality_card_2_head: "같은 데이터, 다른 결론",
        reality_card_2_body: "Frey-Osborne 2013은 미국 직업 47%가 '고위험'이라 했지만, OECD 2016 재추정은 9%. 실제 2013-23 실업률은 평균 4%대였어요.",
        reality_card_3_head: "새 직업이 만들어져요",
        reality_card_3_body: "Autor 2024 분석: 2018년 미국 고용의 60%는 1940년에 없던 직업이에요. 자동화는 새 직업도 만들어요.",
        reality_card_4_head: "노출 ≠ 대체",
        reality_card_4_body: "Acemoglu 2024 추정: 향후 10년 AI 영향은 GDP +0.5–0.9%. '대량 실업' 시나리오는 아니에요.",
        accuracy_notice: "이 데이터는 미국 통계(BLS·O*NET) 기준이라, 한국 상황과는 조금 다를 수 있어요.",
        msg_share_done: "링크를 복사했어요. 어디든 붙여넣어 보세요!",
        msg_no_match: "아직 그 직업은 목록에 없어요. 비슷한 직업명으로 검색해 보세요.",
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
        hint: "Search by job title — your language or English both work.",
        btn_see_dashboard: "See my dashboard",
        btn_share: "Share my dashboard",
        btn_restart: "Try another job",
        result_job_label: "Job",
        result_age_label: "Age",
        result_subtitle: "The big reports only talk in averages. Here's what it looks like for your job.",
        panel_task_title: "What parts of your job AI could take over",
        panel_task_subtitle: "We split your job into smaller tasks and show how much AI could speed up each one.",
        panel_cohort_title: "Compared with people like you + a reality check",
        panel_cohort_subtitle: "Where people in your situation land — plus facts to calm the panic.",
        panel_coming_soon: "Coming in the next release.",
        task_summary: "How much AI could speed up each of this job's {n} tasks",
        donut_sub: "AI-assisted",
        task_interpretation: "Split this job into {total} tasks, and {exposed} of them could get noticeably faster with AI. The rest still need a human's hands.",
        task_reassurance: "But 'faster' isn't 'gone.' Usually the same person just gets more done in the same time.",
        task_show_more: "Show more",
        task_show_less: "Show less",
        task_type_core: "Core",
        task_type_supplemental: "Supplemental",
        legend_T0: "Safe",
        legend_T1: "AI can do it directly",
        legend_T2: "AI + tools can do it",
        legend_T3: "Image / video work",
        legend_T4: "Only partly / still unclear",
        legend_T0_desc: "Using AI wouldn't save much time here.",
        legend_T1_desc: "AI on its own can cut the time by more than half.",
        legend_T2_desc: "AI plus the right tools can cut the time by more than half.",
        legend_T3_desc: "Specialized work like image generation.",
        legend_T4_desc: "Only partly affected, or too early to tell.",
        cohort_position_title: "Where you land among 200 jobs",
        cohort_position_subtitle: "Lined up by how easily AI could do the work",
        cohort_percentile: "Your job is in the top {p}% for AI impact",
        cohort_axis_left: "← Less affected",
        cohort_axis_right: "More affected →",
        reality_check_title: "But first, a reality check",
        reality_check_intro: "4 facts the scary headlines usually skip.",
        reality_card_1_head: "Past automation predictions often miss",
        reality_card_1_body: "After ATMs, US bank tellers grew from 500k (1980) to 600k (2010). Cheaper branches meant more branches were opened.",
        reality_card_2_head: "Same data, different conclusions",
        reality_card_2_body: "Frey-Osborne 2013 said 47% of US jobs were 'high-risk.' OECD 2016 re-estimated 9%. Actual 2013-23 unemployment averaged ~4%.",
        reality_card_3_head: "New jobs are created",
        reality_card_3_body: "Autor 2024: 60% of 2018 US employment is in occupations that didn't exist in 1940. Automation also creates jobs.",
        reality_card_4_head: "Exposure ≠ replacement",
        reality_card_4_body: "Acemoglu 2024: AI's labor-market impact over 10 years is ~+0.5–0.9% GDP. Not a 'mass unemployment' scenario.",
        accuracy_notice: "This data is based on US figures (BLS/O*NET), so your local job market may differ.",
        msg_share_done: "Link copied. Paste anywhere.",
        msg_no_match: "That job isn't on the list yet. Try a similar title.",
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
        hint: "日本語でも英語でも、職業名で検索できます。",
        btn_see_dashboard: "ダッシュボードを見る",
        btn_share: "結果をシェア",
        btn_restart: "別の職業で試す",
        result_job_label: "職業",
        result_age_label: "年齢層",
        result_subtitle: "ニュースが「平均」でしか語らないことを、あなたの職業ひとつに当てはめてみました。",
        panel_task_title: "あなたの仕事で AI が代われる部分",
        panel_task_subtitle: "あなたの仕事を細かく分けて、それぞれ AI がどれくらい手伝えるかを示します。",
        panel_cohort_title: "似た人との比較 + ファクトチェック",
        panel_cohort_subtitle: "似た立場の人がどのあたりにいるか、そして漠然とした不安を和らげる事実。",
        panel_coming_soon: "近日追加予定です。",
        task_summary: "この仕事の {n} 個の作業を AI がどれくらい手伝えるか",
        donut_sub: "AIで加速",
        task_interpretation: "この仕事を {total} 個の作業に分けると、そのうち {exposed} 個は AI をうまく使えば目に見えて速くなります。残りはまだ人の手が必要な作業です。",
        task_reassurance: "ただし「速くなる」は「なくなる」ではありません。多くの場合、同じ人が同じ時間でより多くをこなせるようになります。",
        task_show_more: "もっと見る",
        task_show_less: "閉じる",
        task_type_core: "コア",
        task_type_supplemental: "補助",
        legend_T0: "安全",
        legend_T1: "AI がそのまま代われる",
        legend_T2: "AI + ツールで代われる",
        legend_T3: "画像・映像の作業",
        legend_T4: "一部だけ / まだ不確か",
        legend_T0_desc: "AI を使っても作業時間はあまり減りません。",
        legend_T1_desc: "AI だけで作業時間を半分以上減らせます。",
        legend_T2_desc: "AI に道具を組み合わせれば作業時間を半分以上減らせます。",
        legend_T3_desc: "画像生成などの特殊な作業です。",
        legend_T4_desc: "一部だけ影響を受けるか、まだ判断が難しい段階です。",
        cohort_position_title: "200 の職業の中での、あなたの位置",
        cohort_position_subtitle: "AI が代わりやすい順に並べてみました",
        cohort_percentile: "あなたの職業は AI の影響が大きい方から上位 {p}% です",
        cohort_axis_left: "← 影響小",
        cohort_axis_right: "影響大 →",
        reality_check_title: "その前に、ファクトチェック",
        reality_check_intro: "怖いニュースがよく省く 4 つの事実。",
        reality_card_1_head: "過去の自動化予測はしばしば外れる",
        reality_card_1_body: "ATM 導入後、米国の銀行窓口係は 1980 年 50 万人 → 2010 年 60 万人に増加。支店コストが下がり、店舗数が増えたためです。",
        reality_card_2_head: "同じデータ、異なる結論",
        reality_card_2_body: "Frey-Osborne 2013 は米国職業の 47% が「高リスク」と予測。OECD 2016 の再推計は 9%。実際 2013-23 の失業率は平均約 4%。",
        reality_card_3_head: "新しい職業が生まれている",
        reality_card_3_body: "Autor 2024：2018 年の米国雇用の 60% は 1940 年に存在しなかった職業。自動化は新しい職業も作る。",
        reality_card_4_head: "影響 ≠ 代替",
        reality_card_4_body: "Acemoglu 2024 推計：今後 10 年の AI 労働市場への影響は GDP 比 +0.5–0.9%。「大量失業」シナリオではない。",
        accuracy_notice: "このデータは米国の統計（BLS・O*NET）が基準なので、日本の状況とは少し異なる場合があります。",
        msg_share_done: "リンクをコピーしました。どこへでも貼り付けてください。",
        msg_no_match: "その職業はまだ一覧にありません。近い職業名で検索してみてください。",
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
        hint: "中文、英文職業名都可以搜尋。",
        btn_see_dashboard: "看我的儀表板",
        btn_share: "分享結果",
        btn_restart: "換個職業再試",
        result_job_label: "職業",
        result_age_label: "年齡層",
        result_subtitle: "新聞只講「平均」，這裡換成你這一個職業來看。",
        panel_task_title: "你的工作中，AI 能接手的部分",
        panel_task_subtitle: "把你的工作拆成小項，逐一看 AI 能幫上多少。",
        panel_cohort_title: "和相似的人比較 + 事實查核",
        panel_cohort_subtitle: "處境相近的人落在哪裡，以及能減輕焦慮的事實。",
        panel_coming_soon: "下個版本即將加入。",
        task_summary: "這份工作的 {n} 項工作，AI 各能幫上多少",
        donut_sub: "AI 加速",
        task_interpretation: "把這份工作分成 {total} 項，其中 {exposed} 項只要善用 AI 就能明顯加快。其餘的還是需要人來做。",
        task_reassurance: "但「變快」不等於「消失」。多半是同一個人，在同樣的時間裡完成更多事。",
        task_show_more: "看更多",
        task_show_less: "收起",
        task_type_core: "核心",
        task_type_supplemental: "輔助",
        legend_T0: "安全",
        legend_T1: "AI 可直接接手",
        legend_T2: "AI + 工具可接手",
        legend_T3: "影像／影片工作",
        legend_T4: "只有部分 / 仍不確定",
        legend_T0_desc: "用 AI 也省不了多少時間。",
        legend_T1_desc: "AI 自己就能把時間省下一半以上。",
        legend_T2_desc: "AI 搭配工具就能把時間省下一半以上。",
        legend_T3_desc: "像影像生成這類特殊工作。",
        legend_T4_desc: "只有部分受影響，或還太早判斷。",
        cohort_position_title: "200 種職業裡，你的位置",
        cohort_position_subtitle: "依 AI 接手的難易程度排序",
        cohort_percentile: "你的職業在 AI 影響較大的一端，排在前 {p}%",
        cohort_axis_left: "← 影響小",
        cohort_axis_right: "影響大 →",
        reality_check_title: "先別慌，看看事實",
        reality_check_intro: "嚇人新聞常常略過的 4 個事實。",
        reality_card_1_head: "過去的自動化預測常常落空",
        reality_card_1_body: "ATM 普及後，美國銀行櫃員從 1980 的 50 萬增加到 2010 的 60 萬。分行成本下降，反而開了更多分行。",
        reality_card_2_head: "同樣資料，不同結論",
        reality_card_2_body: "Frey-Osborne 2013 說美國 47% 工作「高風險」。OECD 2016 重新估算為 9%。實際 2013-23 失業率平均約 4%。",
        reality_card_3_head: "新工作正在誕生",
        reality_card_3_body: "Autor 2024 分析：2018 美國 60% 的就業在 1940 年並不存在。自動化也創造新工作。",
        reality_card_4_head: "暴露 ≠ 取代",
        reality_card_4_body: "Acemoglu 2024 估計：未來 10 年 AI 對勞動市場影響約 GDP +0.5–0.9%，非「大規模失業」場景。",
        accuracy_notice: "這份數據以美國統計（BLS／O*NET）為準，台灣的情況可能略有不同。",
        msg_share_done: "已複製連結。貼到任何地方都可以。",
        msg_no_match: "清單裡還沒有這個職業，換相近的職業名試試。",
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
        hint: "Busca por nombre de profesión, en tu idioma o en inglés.",
        btn_see_dashboard: "Ver mi panel",
        btn_share: "Compartir mi panel",
        btn_restart: "Probar otra profesión",
        result_job_label: "Profesión",
        result_age_label: "Edad",
        result_subtitle: "Los grandes informes solo hablan de promedios. Aquí lo ves para tu profesión concreta.",
        panel_task_title: "Qué partes de tu trabajo podría asumir la IA",
        panel_task_subtitle: "Dividimos tu trabajo en tareas y mostramos cuánto podría acelerar la IA en cada una.",
        panel_cohort_title: "Comparación con gente como tú + datos para tranquilizarte",
        panel_cohort_subtitle: "Dónde quedan las personas en tu situación, y datos que calman el miedo.",
        panel_coming_soon: "Disponible en la próxima versión.",
        task_summary: "Cuánto podría acelerar la IA cada una de las {n} tareas de esta profesión",
        donut_sub: "con IA",
        task_interpretation: "Si dividimos este trabajo en {total} tareas, {exposed} podrían ir mucho más rápido con IA. El resto aún necesita manos humanas.",
        task_reassurance: "Pero 'más rápido' no es 'desaparece'. Normalmente la misma persona hace más en el mismo tiempo.",
        task_show_more: "Ver más",
        task_show_less: "Ver menos",
        task_type_core: "Esencial",
        task_type_supplemental: "Suplementario",
        legend_T0: "Seguro",
        legend_T1: "La IA puede hacerlo directamente",
        legend_T2: "La IA con herramientas puede hacerlo",
        legend_T3: "Trabajo de imagen / vídeo",
        legend_T4: "Solo en parte / aún incierto",
        legend_T0_desc: "Usar IA no ahorraría mucho tiempo aquí.",
        legend_T1_desc: "La IA por sí sola puede reducir el tiempo a más de la mitad.",
        legend_T2_desc: "La IA con las herramientas adecuadas reduce el tiempo a más de la mitad.",
        legend_T3_desc: "Trabajo especializado, como generar imágenes.",
        legend_T4_desc: "Solo afecta en parte, o es pronto para saberlo.",
        cohort_position_title: "Tu lugar entre 200 profesiones",
        cohort_position_subtitle: "Ordenadas según lo fácil que le resulta a la IA",
        cohort_percentile: "Tu profesión está en el {p}% más afectado por la IA",
        cohort_axis_left: "← Menos afectado",
        cohort_axis_right: "Más afectado →",
        reality_check_title: "Pero antes, un poco de realidad",
        reality_check_intro: "4 datos que los titulares alarmistas suelen omitir.",
        reality_card_1_head: "Las predicciones de automatización suelen fallar",
        reality_card_1_body: "Tras los cajeros automáticos, los cajeros bancarios en EE. UU. crecieron de 500k (1980) a 600k (2010). Sucursales más baratas significan más sucursales.",
        reality_card_2_head: "Mismos datos, distintas conclusiones",
        reality_card_2_body: "Frey-Osborne 2013 estimó 47% de empleos en 'alto riesgo'. La OCDE en 2016 lo reestimó en 9%. El desempleo real 2013-23 promedió ~4%.",
        reality_card_3_head: "Se crean nuevos empleos",
        reality_card_3_body: "Autor 2024: el 60% del empleo de EE. UU. en 2018 está en ocupaciones que no existían en 1940. La automatización también crea empleos.",
        reality_card_4_head: "Exposición ≠ reemplazo",
        reality_card_4_body: "Acemoglu 2024: el impacto laboral de la IA en 10 años es ~+0,5–0,9% del PIB. No es un escenario de 'desempleo masivo'.",
        accuracy_notice: "Estos datos se basan en cifras de EE. UU. (BLS/O*NET), así que tu mercado local puede variar.",
        msg_share_done: "Enlace copiado. Pégalo donde quieras.",
        msg_no_match: "Esa profesión aún no está en la lista. Prueba con un nombre parecido.",
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
        hint: "Such nach dem Berufsnamen – auf Deutsch oder Englisch.",
        btn_see_dashboard: "Mein Dashboard zeigen",
        btn_share: "Dashboard teilen",
        btn_restart: "Anderen Beruf testen",
        result_job_label: "Beruf",
        result_age_label: "Alter",
        result_subtitle: "Große Studien reden nur über Durchschnitte. Hier siehst du es für deinen Beruf.",
        panel_task_title: "Welche Teile deiner Arbeit die KI übernehmen könnte",
        panel_task_subtitle: "Wir zerlegen deine Arbeit in einzelne Aufgaben und zeigen, wie viel die KI je davon beschleunigen könnte.",
        panel_cohort_title: "Vergleich mit Leuten wie dir + Fakten-Check",
        panel_cohort_subtitle: "Wo Menschen in deiner Lage stehen – und Fakten, die die Angst dämpfen.",
        panel_coming_soon: "Kommt im nächsten Release.",
        task_summary: "Wie viel die KI bei jeder der {n} Aufgaben dieses Berufs beschleunigen könnte",
        donut_sub: "mit KI",
        task_interpretation: "Teilt man diesen Beruf in {total} Aufgaben, könnten {exposed} davon mit KI deutlich schneller gehen. Der Rest braucht weiter Menschenhand.",
        task_reassurance: "Aber 'schneller' heißt nicht 'weg'. Meist schafft dieselbe Person in derselben Zeit einfach mehr.",
        task_show_more: "Mehr anzeigen",
        task_show_less: "Ausblenden",
        task_type_core: "Kern",
        task_type_supplemental: "Ergänzend",
        legend_T0: "Sicher",
        legend_T1: "KI kann es direkt übernehmen",
        legend_T2: "KI mit Tools kann es übernehmen",
        legend_T3: "Bild- / Videoarbeit",
        legend_T4: "Nur teils / noch unklar",
        legend_T0_desc: "Mit KI würdest du hier kaum Zeit sparen.",
        legend_T1_desc: "Die KI allein kann die Zeit um mehr als die Hälfte verkürzen.",
        legend_T2_desc: "Die KI mit den passenden Tools verkürzt die Zeit um mehr als die Hälfte.",
        legend_T3_desc: "Spezialarbeit wie Bildgenerierung.",
        legend_T4_desc: "Nur teilweise betroffen oder noch zu früh, um es zu sagen.",
        cohort_position_title: "Dein Platz unter 200 Berufen",
        cohort_position_subtitle: "Sortiert danach, wie leicht die KI die Arbeit übernimmt",
        cohort_percentile: "Dein Beruf liegt bei den oberen {p}% mit dem stärksten KI-Einfluss",
        cohort_axis_left: "← Weniger betroffen",
        cohort_axis_right: "Stärker betroffen →",
        reality_check_title: "Aber erst mal: ein Fakten-Check",
        reality_check_intro: "4 Fakten, die in den Angst-Schlagzeilen meist fehlen.",
        reality_card_1_head: "Automatisierungsprognosen liegen oft daneben",
        reality_card_1_body: "Nach Geldautomaten stieg die Zahl der US-Bankangestellten von 500k (1980) auf 600k (2010). Günstigere Filialen führten zu mehr Filialen.",
        reality_card_2_head: "Gleiche Daten, andere Schlussfolgerungen",
        reality_card_2_body: "Frey-Osborne 2013 sah 47% der US-Jobs als 'hochrisikoreich'. OECD 2016 schätzte 9%. Die Arbeitslosigkeit 2013-23 lag im Schnitt bei ~4%.",
        reality_card_3_head: "Neue Berufe entstehen",
        reality_card_3_body: "Autor 2024: 60% der US-Beschäftigung 2018 entfallen auf Berufe, die es 1940 nicht gab. Automatisierung schafft auch neue Jobs.",
        reality_card_4_head: "Exposition ≠ Ersatz",
        reality_card_4_body: "Acemoglu 2024 schätzt den KI-Arbeitsmarkteffekt über 10 Jahre auf ~+0,5–0,9% BIP. Kein 'Massenarbeitslosigkeit'-Szenario.",
        accuracy_notice: "Diese Daten beruhen auf US-Zahlen (BLS/O*NET), dein lokaler Arbeitsmarkt kann also abweichen.",
        msg_share_done: "Link kopiert. Überall einfügen.",
        msg_no_match: "Dieser Beruf ist noch nicht in der Liste. Versuch einen ähnlichen Namen.",
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
    state.occupations = await occRes.json();

    // Also index the English titles so users can search in English on any
    // locale page (e.g. typing "software" on the Korean site). Non-fatal.
    if (suffix) {
        try {
            const enRes = await fetch(`${DATA_BASE}/occupations.json`, { cache: "force-cache" });
            if (enRes.ok) {
                const enData = await enRes.json();
                const enBySoc = new Map(enData.map(o => [o.soc, o.title]));
                for (const o of state.occupations) o.en_title = enBySoc.get(o.soc) || "";
            }
        } catch { /* English alias is optional */ }
    }

    // meta.json is non-critical (not read by the core flow). Never let a meta
    // fetch/parse failure abort init — otherwise no event listeners attach and
    // the whole form (job select, age, submit) goes dead.
    try {
        const metaRes = await fetch(`${DATA_BASE}/meta.json`, { cache: "force-cache" });
        if (metaRes.ok) state.meta = await metaRes.json();
    } catch { /* ignore — meta is unused by the selection/dashboard flow */ }
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
        const en = normalize(o.en_title);
        const inTitle = title.includes(q);
        const inEn = en && en.includes(q);
        if (inTitle || inEn) {
            // rank: starts-with (either language) > contains
            const starts = title.startsWith(q) || (en && en.startsWith(q));
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
    // Otherwise try exact (case-insensitive) match on input value.
    const q = normalize(raw);
    if (!q) return null;
    const exact = state.occupations.find(o => normalize(o.title) === q || normalize(o.en_title) === q);
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
        `<text x="${cx}" y="${cy - 5}" text-anchor="middle" dominant-baseline="central" class="donut-pct">${pct}%</text>` +
        `<text x="${cx}" y="${cy + 13}" text-anchor="middle" dominant-baseline="central" class="donut-sub">${escapeHtml(t("donut_sub"))}</text>` +
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

    const donutSvg = buildDonutSVG(dist, total);
    const exposedCount = (dist.T1 || 0) + (dist.T2 || 0) + (dist.T3 || 0);
    const interpretation = t("task_interpretation")
        .replace("{total}", total)
        .replace("{exposed}", exposedCount);
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

    el.innerHTML = `
        <h3 class="dashboard-panel-title">${escapeHtml(t("panel_task_title"))}</h3>
        <p class="dashboard-panel-subtitle">${escapeHtml(t("panel_task_subtitle"))}</p>
        <p class="task-summary">${escapeHtml(summary)}</p>
        <div class="exposure-overview">
            ${donutSvg}
            <div class="exposure-breakdown">${breakdownRows}</div>
        </div>
        <p class="task-interpretation">${escapeHtml(interpretation)}</p>
        <p class="task-reassurance">${escapeHtml(t("task_reassurance"))}</p>
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
