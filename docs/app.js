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
        accuracy_notice: "v1-Daten = US (BLS/O*NET). Lokaler Markt kann abweichen.",
        msg_share_done: "Link kopiert. Überall einfügen.",
        msg_no_match: "Dieser Beruf ist in v1 noch nicht dabei. Versuche einen ähnlichen englischen Titel.",
        msg_pick_age: "Wähle auch eine Altersgruppe.",
        footer_tagline: "Karriere-Koordinaten für das KI-Zeitalter"
    }
};

const DATA_BASE = "../public/data/v2";
const AGE_COHORTS = ["20s", "30s", "40s", "50p"];

const state = {
    lang: "ko",
    occupations: null,   // array from v2/occupations.json
    meta: null,
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

    // PR #3 fills #panel-task-heatmap; PR #4 fills #panel-cohort-reality.
    // Render placeholders for now so the layout is visible.
    renderPanelPlaceholder("panel-task-heatmap", "panel_task_title", "panel_task_subtitle");
    renderPanelPlaceholder("panel-cohort-reality", "panel_cohort_title", "panel_cohort_subtitle");

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
