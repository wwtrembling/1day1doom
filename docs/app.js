// 1Day1Doom — single-page dual-path × persona diagnostic.
//
// Layout: one HTML page with three vertically-stacked sections that reveal
// progressively as the user fills in their job and answers all 5 quiz questions.
// Deep-link `?job=<id>&persona=<code>` skips the form and renders the result only.

const UI_TEXT = {
    ko: {
        app_title: "1Day1Doom",
        slogan: "AI가 내 직업을 잡아먹나? — 5문항으로 30년 두 갈래 운명을 본다",
        input_title: "내 직업 입력",
        label_job: "직업",
        placeholder_job: "예: 백엔드 개발자, 교사, 간호사…",
        hint: "직업을 고르면 5문항이 나오고, 모두 답하면 결과가 같은 페이지에 나타나요.",
        btn_share: "결과 공유",
        btn_other_persona: "다른 페르소나도 보기",
        btn_restart_quiz: "다른 직업으로 다시",
        result_job_label: "내 직업",
        msg_share_done: "링크가 복사됐어요. SNS에 붙여넣기!",
        msg_no_match: "준비된 직업이 아니에요. 비슷한 직업을 골라주세요.",
        year_now: "지금",
        year_10: "10년 후",
        year_30: "30년 후",
        skills_label: "핵심 역량",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AI에 자리를 내주는 경로",
        path_bloom_desc: "AI와 함께 진화하는 경로",
        bias_label: "당신의 자연 결말",
        quiz_intro: "AI 시대, 당신은 어디에 서 있나요?",
        persona_card_title: "당신의 부캐",
        quiz_title: "5문항 진단"
    },
    en: {
        app_title: "1Day1Doom",
        slogan: "Will AI eat my job? — Diagnose your 30-year split fate in 5 questions.",
        input_title: "Your Job",
        label_job: "Job",
        placeholder_job: "e.g. Backend Developer, Teacher, Nurse…",
        hint: "Pick a job, answer 5 questions, and the result appears on the same page.",
        btn_share: "Share Result",
        btn_other_persona: "See another persona",
        btn_restart_quiz: "Try another job",
        result_job_label: "Your job",
        msg_share_done: "Link copied! Paste it anywhere.",
        msg_no_match: "We don't have that one yet. Pick a similar job.",
        year_now: "Now",
        year_10: "10 years",
        year_30: "30 years",
        skills_label: "Key skills",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "Where AI takes the seat",
        path_bloom_desc: "Where you evolve with AI",
        bias_label: "Your natural ending",
        quiz_intro: "In the age of AI, where do you stand?",
        persona_card_title: "Your alter-ego",
        quiz_title: "5-question diagnosis"
    },
    ja: {
        app_title: "1Day1Doom",
        slogan: "AIに仕事を奪われる？ 5問で30年後の二択運命を診断する",
        input_title: "あなたの職業",
        label_job: "職業",
        placeholder_job: "例: バックエンド開発者、教師、看護師…",
        hint: "職業を選び、5問に答えると、結果が同じページに表示されます。",
        btn_share: "結果を共有",
        btn_other_persona: "別のペルソナも見る",
        btn_restart_quiz: "別の職業でやり直す",
        result_job_label: "あなたの職業",
        msg_share_done: "リンクをコピーしました。SNSに貼り付けてください。",
        msg_no_match: "まだ用意されていません。似た職業を選んでください。",
        year_now: "今",
        year_10: "10年後",
        year_30: "30年後",
        skills_label: "コアスキル",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AIに席を譲る道",
        path_bloom_desc: "AIと共に進化する道",
        bias_label: "あなたの自然な結末",
        quiz_intro: "AI時代、あなたはどこに立っている？",
        persona_card_title: "あなたの分身",
        quiz_title: "5問診断"
    },
    "zh-tw": {
        app_title: "1Day1Doom",
        slogan: "AI 會吃掉你的工作嗎？— 5 題診斷你 30 年後的兩條命運",
        input_title: "輸入你的職業",
        label_job: "職業",
        placeholder_job: "例：後端工程師、教師、護理師…",
        hint: "選擇職業，回答 5 題，結果會在同一頁顯示。",
        btn_share: "分享結果",
        btn_other_persona: "看其他角色",
        btn_restart_quiz: "換一個職業",
        result_job_label: "你的職業",
        msg_share_done: "連結已複製。貼到任何地方都可以分享。",
        msg_no_match: "還沒有這個職業。請選一個相近的。",
        year_now: "現在",
        year_10: "10 年後",
        year_30: "30 年後",
        skills_label: "核心技能",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AI 接手位置的路徑",
        path_bloom_desc: "與 AI 共同進化的路徑",
        bias_label: "你的自然結局",
        quiz_intro: "AI 時代，你站在哪裡？",
        persona_card_title: "你的分身",
        quiz_title: "5 題診斷"
    },
    es: {
        app_title: "1Day1Doom",
        slogan: "¿La IA se comerá tu trabajo? — Diagnostica tu destino bifurcado a 30 años en 5 preguntas",
        input_title: "Tu trabajo",
        label_job: "Trabajo",
        placeholder_job: "ej. Desarrollador Backend, Profesor, Enfermera…",
        hint: "Elige un trabajo, responde 5 preguntas y el resultado aparece en la misma página.",
        btn_share: "Compartir resultado",
        btn_other_persona: "Ver otra persona",
        btn_restart_quiz: "Probar otro trabajo",
        result_job_label: "Tu trabajo",
        msg_share_done: "¡Enlace copiado! Pégalo donde quieras.",
        msg_no_match: "Aún no lo tenemos. Elige un trabajo similar.",
        year_now: "Ahora",
        year_10: "10 años",
        year_30: "30 años",
        skills_label: "Habilidades clave",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "Donde la IA toma el asiento",
        path_bloom_desc: "Donde evolucionas con la IA",
        bias_label: "Tu final natural",
        quiz_intro: "En la era de la IA, ¿dónde estás?",
        persona_card_title: "Tu alter ego",
        quiz_title: "Diagnóstico de 5 preguntas"
    },
    de: {
        app_title: "1Day1Doom",
        slogan: "Frisst KI deinen Job? — Diagnostiziere dein 30-Jahre-Schicksal in 5 Fragen",
        input_title: "Dein Beruf",
        label_job: "Beruf",
        placeholder_job: "z. B. Backend-Entwickler, Lehrer, Krankenpfleger…",
        hint: "Beruf wählen, 5 Fragen beantworten — das Ergebnis erscheint auf derselben Seite.",
        btn_share: "Ergebnis teilen",
        btn_other_persona: "Andere Persona ansehen",
        btn_restart_quiz: "Anderen Beruf versuchen",
        result_job_label: "Dein Beruf",
        msg_share_done: "Link kopiert. Einfach einfügen.",
        msg_no_match: "Den haben wir noch nicht. Wähl einen ähnlichen.",
        year_now: "Jetzt",
        year_10: "in 10 Jahren",
        year_30: "in 30 Jahren",
        skills_label: "Kernkompetenzen",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "Wo die KI den Platz übernimmt",
        path_bloom_desc: "Wo du mit der KI mitwächst",
        bias_label: "Dein natürliches Ende",
        quiz_intro: "Im KI-Zeitalter — wo stehst du?",
        persona_card_title: "Dein Alter Ego",
        quiz_title: "5-Fragen-Diagnose"
    }
};

const FALLBACK_CHAIN = {
    ko: ["ko", "en"],
    en: ["en", "ko"],
    ja: ["ja", "en", "ko"],
    "zh-tw": ["zh-tw", "en", "ko"],
    es: ["es", "en", "ko"],
    de: ["de", "en", "ko"]
};

const DATA_BASE = "../public/data";
const PERSONA_CODES = ["AS", "AC", "RS", "RC"];

let currentLang = "ko";
let manifest = null;
let quiz = null;
let evolution = null;
let state = {
    jobId: null,
    answers: [],
    persona: null,
    phase: "input"     // "input" | "quiz" | "result"
};

function t(key) {
    return UI_TEXT[currentLang][key] || UI_TEXT.en[key] || key;
}

function pick(obj, ...candidateKeys) {
    if (!obj) return "";
    for (const k of candidateKeys) {
        const v = obj[k];
        if (v !== undefined && v !== null && v !== "") return v;
    }
    return "";
}

function localized(obj) {
    if (!obj) return "";
    const chain = FALLBACK_CHAIN[currentLang] || ["en", "ko"];
    for (const k of chain) {
        if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return "";
}

function localizedField(obj, prefix) {
    if (!obj) return "";
    const chain = FALLBACK_CHAIN[currentLang] || ["en", "ko"];
    for (const k of chain) {
        const v = obj[`${prefix}_${k}`];
        if (v !== undefined && v !== null && v !== "") return v;
    }
    return "";
}

function localizedStage(stage) {
    if (!stage) return {};
    const chain = FALLBACK_CHAIN[currentLang] || ["en", "ko"];
    for (const k of chain) {
        if (stage[k]) return stage[k];
    }
    return {};
}

document.addEventListener("DOMContentLoaded", async () => {
    currentLang = (document.documentElement.lang || "ko").toLowerCase();
    if (!UI_TEXT[currentLang]) currentLang = "ko";
    applyI18n();

    document.getElementById("job-form").addEventListener("submit", onJobSubmit);
    document.getElementById("btn-restart").addEventListener("click", restartFlow);
    document.getElementById("btn-share").addEventListener("click", onShare);
    const btnOtherPersona = document.getElementById("btn-other-persona");
    if (btnOtherPersona) btnOtherPersona.addEventListener("click", cycleNextPersona);

    const input = document.getElementById("job-input");
    input.addEventListener("input", onInputChange);
    input.addEventListener("focus", onInputChange);
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".form-group")) hideSuggestions();
    });

    await Promise.all([loadManifest(), loadQuiz()]);

    const params = new URLSearchParams(window.location.search);
    const deepJob = params.get("job");
    const deepPersona = (params.get("persona") || "").toUpperCase();

    if (deepJob && PERSONA_CODES.includes(deepPersona)) {
        const entry = findJob(deepJob);
        if (entry) {
            await goResult(entry.id, deepPersona, { fromDeepLink: true });
            return;
        }
    }
    if (deepJob) {
        const entry = findJob(deepJob);
        if (entry) {
            input.value = pick(entry, `label_${currentLang}`, "label_en", "label_ko");
            await startQuiz(entry.id);
            return;
        }
    }
    const saved = localStorage.getItem("evo_last_input");
    if (saved) input.value = saved;
    setPhase("input");
});

function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const txt = t(key);
        if (txt) el.textContent = txt;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const txt = t(key);
        if (txt) el.placeholder = txt;
    });
    document.title = t("app_title") + " — " + t("slogan");
}

async function loadManifest() {
    try {
        const res = await fetch(`${DATA_BASE}/jobs.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("manifest fetch failed");
        manifest = await res.json();
    } catch (e) {
        console.error("Failed to load manifest:", e);
        manifest = { jobs: [] };
    }
}

async function loadQuiz() {
    try {
        const res = await fetch(`${DATA_BASE}/quiz.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("quiz fetch failed");
        quiz = await res.json();
    } catch (e) {
        console.error("Failed to load quiz:", e);
        quiz = { questions: [] };
    }
}

function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, "").trim();
}

function jobAllLabels(j) {
    const locales = (manifest && manifest.locales) || ["ko", "en", "ja", "zh-tw", "es", "de"];
    const out = [];
    for (const loc of locales) {
        const v = j["label_" + loc];
        if (v) out.push(v);
    }
    for (const a of (j.aliases_ko || [])) out.push(a);
    return out;
}

function findJob(query) {
    if (!manifest || !manifest.jobs) return null;
    const q = normalize(query);
    if (!q) return null;
    for (const j of manifest.jobs) {
        if (j.id === query) return j;
        for (const lab of jobAllLabels(j)) {
            if (normalize(lab) === q) return j;
        }
    }
    return null;
}

function suggestJobs(query) {
    if (!manifest || !manifest.jobs) return [];
    const q = normalize(query);
    if (!q) return manifest.jobs.slice(0, 12);
    const scored = [];
    for (const j of manifest.jobs) {
        const labels = jobAllLabels(j).map(normalize);
        let score = 0;
        for (const lab of labels) {
            if (!lab) continue;
            if (lab === q) score = Math.max(score, 100);
            else if (lab.startsWith(q)) score = Math.max(score, 60);
            else if (lab.includes(q)) score = Math.max(score, 30);
        }
        if (score > 0) scored.push({ j, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map(x => x.j);
}

function jobLabel(j) {
    return pick(j, `label_${currentLang}`, "label_en", "label_ko") || j.id;
}

function onInputChange(e) {
    const q = e.target.value;
    const matches = suggestJobs(q);
    const list = document.getElementById("job-suggestions");
    list.innerHTML = "";
    if (!matches.length) {
        list.style.display = "none";
        return;
    }
    for (const j of matches) {
        const li = document.createElement("li");
        li.innerHTML = `<span class="suggest-emoji">${escapeHtml(j.emoji || "✨")}</span> ${escapeHtml(jobLabel(j))}`;
        li.addEventListener("mousedown", (ev) => {
            ev.preventDefault();
            document.getElementById("job-input").value = jobLabel(j);
            hideSuggestions();
        });
        list.appendChild(li);
    }
    list.style.display = "block";
}

function hideSuggestions() {
    const list = document.getElementById("job-suggestions");
    list.style.display = "none";
    list.innerHTML = "";
}

function setPhase(phase) {
    state.phase = phase;
    const inputSec = document.getElementById("input-section");
    const quizSec = document.getElementById("quiz-section");
    const resultSec = document.getElementById("result-section");
    inputSec.classList.toggle("hidden", phase === "result-only");
    quizSec.classList.toggle("hidden", phase === "input" || phase === "result-only");
    resultSec.classList.toggle("hidden", phase !== "result" && phase !== "result-only");
    if (phase === "result-only") {
        // deep-link arrival: hide everything except result for clean share landing
        document.body.classList.add("result-only");
    } else {
        document.body.classList.remove("result-only");
    }
}

async function onJobSubmit(e) {
    e.preventDefault();
    const raw = document.getElementById("job-input").value.trim();
    if (!raw) return;
    localStorage.setItem("evo_last_input", raw);

    let entry = findJob(raw);
    if (!entry) {
        const sugg = suggestJobs(raw);
        if (sugg.length) entry = sugg[0];
    }
    if (!entry) {
        alert(t("msg_no_match"));
        return;
    }
    await startQuiz(entry.id);
}

async function startQuiz(jobId) {
    state.jobId = jobId;
    state.answers = new Array((quiz.questions || []).length).fill(null);
    state.persona = null;

    // Clear any previous result
    document.getElementById("result-section").classList.add("hidden");
    state.phase = "quiz";
    setPhase("quiz");

    renderAllQuestions();

    const url = new URL(window.location.href);
    url.searchParams.set("job", jobId);
    url.searchParams.delete("persona");
    history.replaceState(null, "", url);

    // Smooth scroll to quiz section
    smoothScrollTo("quiz-section", "start");
}

function renderAllQuestions() {
    const container = document.getElementById("quiz-questions");
    container.innerHTML = "";
    const total = (quiz.questions || []).length;

    quiz.questions.forEach((q, idx) => {
        const text = pick(q, currentLang, "en", "ko");
        const optsHtml = (q.options || []).map((o) => {
            const label = pick(o, currentLang, "en", "ko");
            return `<button type="button" class="quiz-option" data-q="${idx}" data-value="${escapeHtml(o.value)}">${escapeHtml(label)}</button>`;
        }).join("");

        const card = document.createElement("div");
        card.className = "quiz-card";
        card.id = `q-${idx}`;
        card.innerHTML = `
            <div class="quiz-progress">${idx + 1} / ${total}</div>
            <h3 class="quiz-question">${escapeHtml(text)}</h3>
            <div class="quiz-options">${optsHtml}</div>
        `;
        container.appendChild(card);
    });

    container.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", () => onAnswerSelected(parseInt(btn.dataset.q, 10), btn.dataset.value));
    });
}

function onAnswerSelected(qIdx, value) {
    state.answers[qIdx] = value;

    // Mark this question's selected option
    const card = document.getElementById(`q-${qIdx}`);
    if (card) {
        card.querySelectorAll(".quiz-option").forEach(btn => {
            btn.classList.toggle("selected", btn.dataset.value === value);
        });
        card.classList.add("answered");
    }

    // If not yet last question, scroll to next unanswered question
    const next = state.answers.findIndex((a, i) => a === null && i > qIdx);
    if (next !== -1) {
        smoothScrollTo(`q-${next}`, "center");
        return;
    }

    // All answered → compute persona, render result
    if (state.answers.every(a => a !== null)) {
        const persona = calculatePersona();
        goResult(state.jobId, persona);
    }
}

function calculatePersona() {
    let arSum = 0;
    let scSum = 0;
    (quiz.questions || []).forEach((q, i) => {
        const ans = state.answers[i];
        if (!ans) return;
        if (q.axis === "AR") {
            if (ans === "A") arSum += 1;
            else if (ans === "R") arSum -= 1;
        } else if (q.axis === "SC") {
            if (ans === "C") scSum += 1;
            else if (ans === "S") scSum -= 1;
        }
    });
    const ar = arSum > 0 ? "A" : "R";
    const sc = scSum > 0 ? "C" : "S";
    const code = ar + sc;
    return PERSONA_CODES.includes(code) ? code : "AS";
}

async function goResult(jobId, personaCode, { fromDeepLink = false } = {}) {
    state.jobId = jobId;
    state.persona = personaCode;

    if (fromDeepLink) {
        setPhase("result-only");
    } else {
        setPhase("result");
    }

    try {
        if (!evolution || evolution.job_id !== jobId) {
            const res = await fetch(`${DATA_BASE}/jobs/${jobId}/evolution.json`, { cache: "no-store" });
            if (!res.ok) throw new Error("evolution fetch failed");
            evolution = await res.json();
        }
        renderResult();

        const url = new URL(window.location.href);
        url.searchParams.set("job", jobId);
        url.searchParams.set("persona", personaCode);
        history.replaceState(null, "", url);

        smoothScrollTo("result-section", "start");
    } catch (e) {
        console.error(e);
        alert(t("msg_no_match"));
        restartFlow();
    }
}

function renderResult() {
    const ev = evolution;
    if (!ev) return;
    const code = state.persona;
    const persona = (ev.personas || {})[code] || {};
    const bias = persona.bias === "doom" ? "doom" : "bloom";
    const emoji = ev.emoji || "✨";

    const evLabelObj = {
        ko: ev.label_ko, en: ev.label_en, ja: ev.label_ja,
        "zh-tw": ev["label_zh-tw"], es: ev.label_es, de: ev.label_de
    };
    const jobLabelText = localized(evLabelObj) || ev.label_en || ev.label_ko;

    const nickname = localizedField(persona, "nickname") || code;
    const blurb = localizedField(persona, "blurb") || "";
    const hookCopy = localized((ev.hook_copy || {})[bias] || {}) || "";

    document.getElementById("result-job-name").textContent = jobLabelText;
    document.getElementById("persona-emoji").textContent = emoji;
    document.getElementById("persona-nickname").textContent = nickname;
    document.getElementById("persona-blurb").textContent = blurb;
    document.getElementById("persona-bias-path").textContent =
        bias === "doom" ? t("path_doom_title") : t("path_bloom_title");
    document.getElementById("hook-copy").textContent = hookCopy;

    // Year 0 — shared across paths
    const year0Card = document.getElementById("year0-card");
    year0Card.innerHTML = renderStageInner(ev.year0, 0, emoji, "year0");

    // Bloom + Doom paths
    const bloomStages = ((ev.paths && ev.paths.bloom && ev.paths.bloom.stages) || []).slice().sort((a, b) => a.year - b.year);
    const doomStages = ((ev.paths && ev.paths.doom && ev.paths.doom.stages) || []).slice().sort((a, b) => a.year - b.year);

    document.getElementById("bloom-tree").innerHTML = bloomStages.map(s =>
        `<div class="evo-card stage-${s.year} path-bloom">${renderStageInner(s, s.year, emoji, "bloom")}</div>`
    ).join("");
    document.getElementById("bloom-tree-wrap").classList.toggle("path-bias", bias === "bloom");
    document.getElementById("bloom-tree-title").textContent = t("path_bloom_title");
    document.getElementById("bloom-tree-desc").textContent = t("path_bloom_desc");

    document.getElementById("doom-tree").innerHTML = doomStages.map(s =>
        `<div class="evo-card stage-${s.year} path-doom">${renderStageInner(s, s.year, emoji, "doom")}</div>`
    ).join("");
    document.getElementById("doom-tree-wrap").classList.toggle("path-bias", bias === "doom");
    document.getElementById("doom-tree-title").textContent = t("path_doom_title");
    document.getElementById("doom-tree-desc").textContent = t("path_doom_desc");
}

function renderStageInner(stage, year, emoji, pathKey) {
    const sl = localizedStage(stage);
    const skills = Array.isArray(sl.skills) ? sl.skills : [];
    const yearLabel = year === 0 ? t("year_now") : year === 10 ? t("year_10") : t("year_30");
    const pathBadge = pathKey === "doom" ? "DOOM" : pathKey === "bloom" ? "BLOOM" : "";
    return `
        <div class="evo-card-head">
            <div class="evo-card-year">${escapeHtml(yearLabel)}</div>
            ${pathBadge ? `<div class="evo-card-path-badge">${escapeHtml(pathBadge)}</div>` : ""}
        </div>
        <div class="evo-card-emoji">${escapeHtml(emoji)}</div>
        <h3 class="evo-card-title">${escapeHtml(sl.title || "")}</h3>
        <p class="evo-card-desc">${escapeHtml(sl.description || "")}</p>
        <div class="evo-card-skills">
            <div class="evo-card-skills-label">${t("skills_label")}</div>
            <ul>
                ${skills.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
            </ul>
        </div>
    `;
}

function smoothScrollTo(id, block) {
    requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        if (typeof el.scrollIntoView === "function") {
            el.scrollIntoView({ behavior: "smooth", block: block || "start" });
        }
    });
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function restartFlow() {
    state = { jobId: null, answers: [], persona: null, phase: "input" };
    evolution = null;
    document.getElementById("quiz-questions").innerHTML = "";
    setPhase("input");
    const url = new URL(window.location.href);
    url.searchParams.delete("job");
    url.searchParams.delete("persona");
    history.replaceState(null, "", url);
    smoothScrollTo("input-section", "start");
}

async function cycleNextPersona() {
    if (!state.jobId || !state.persona) return;
    const idx = PERSONA_CODES.indexOf(state.persona);
    const next = PERSONA_CODES[(idx + 1) % PERSONA_CODES.length];
    await goResult(state.jobId, next);
}

async function onShare() {
    if (!evolution || !state.persona) return;
    const url = new URL(window.location.href);
    url.searchParams.set("job", state.jobId);
    url.searchParams.set("persona", state.persona);
    const shareUrl = url.toString();

    const caption = localized(evolution.share_caption || {}) || t("slogan");
    const text = caption + "\n\n" + shareUrl;

    if (navigator.share) {
        try {
            await navigator.share({ title: t("app_title"), text, url: shareUrl });
            return;
        } catch (e) { /* user canceled */ }
    }
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        alert(t("msg_share_done"));
    } catch (e) {
        console.error("share failed", e);
    }
}
