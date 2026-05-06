// 1Day1Doom — dual-path × persona evolution diagnostic
//
// Phases: job_select → quiz (5 questions) → result (persona + Doom/Bloom tree)
// URL params:
//   ?job=<id>                  → preselects job, starts quiz
//   ?job=<id>&persona=<code>   → jumps directly to result page (share link)

const UI_TEXT = {
    ko: {
        app_title: "1Day1Doom",
        slogan: "AI가 내 직업을 잡아먹나? — 5문항으로 30년 두 갈래 운명을 본다",
        input_title: "내 직업 입력",
        label_job: "직업",
        placeholder_job: "예: 백엔드 개발자, 교사, 간호사…",
        hint: "직업 선택 → 5문항 → 30년 후 두 갈래 운명 카드.",
        btn_submit: "시작하기",
        btn_retry: "다른 직업으로",
        btn_share: "결과 공유",
        btn_other_persona: "다른 페르소나도 보기",
        btn_restart_quiz: "다른 직업으로 다시",
        result_job_label: "내 직업",
        msg_loading_evolution: "분석 중…",
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
        quiz_progress: "{n} / {total}",
        quiz_intro: "AI 시대, 당신은 어디에 서 있나요?",
        persona_card_title: "당신의 부캐",
        compare_others: "다른 페르소나 결과 보기"
    },
    en: {
        app_title: "1Day1Doom",
        slogan: "Will AI eat my job? — Diagnose your 30-year split fate in 5 questions.",
        input_title: "Your Job",
        label_job: "Job",
        placeholder_job: "e.g. Backend Developer, Teacher, Nurse…",
        hint: "Pick a job → 5 questions → see your 30-year split fate.",
        btn_submit: "Start",
        btn_retry: "Try Another Job",
        btn_share: "Share Result",
        btn_other_persona: "See another persona",
        btn_restart_quiz: "Try another job",
        result_job_label: "Your job",
        msg_loading_evolution: "Analyzing…",
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
        quiz_progress: "{n} / {total}",
        quiz_intro: "In the age of AI, where do you stand?",
        persona_card_title: "Your alter-ego",
        compare_others: "See other personas"
    }
};

const DATA_BASE = "../public/data";
const PERSONA_CODES = ["AS", "AC", "RS", "RC"];

let currentLang = "ko";
let manifest = null;
let quiz = null;
let evolution = null;          // currently-loaded evolution.json
let state = {
    phase: "job_select",       // job_select | quiz | result
    jobId: null,
    answers: [],               // array of answer values, indexed by question
    questionIdx: 0,
    persona: null              // "AS" | "AC" | "RS" | "RC"
};

function t(key) {
    return UI_TEXT[currentLang][key] || key;
}

document.addEventListener("DOMContentLoaded", async () => {
    currentLang = document.documentElement.lang === "en" ? "en" : "ko";
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
            await goResult(entry.id, deepPersona);
            return;
        }
    }
    if (deepJob) {
        const entry = findJob(deepJob);
        if (entry) {
            input.value = currentLang === "ko" ? entry.label_ko : entry.label_en;
            startQuiz(entry.id);
            return;
        }
    }
    const saved = localStorage.getItem("evo_last_input");
    if (saved) input.value = saved;
    showPhase("job_select");
});

function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const txt = UI_TEXT[currentLang][key];
        if (txt) el.textContent = txt;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const txt = UI_TEXT[currentLang][key];
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

function findJob(query) {
    if (!manifest || !manifest.jobs) return null;
    const q = normalize(query);
    if (!q) return null;
    for (const j of manifest.jobs) {
        if (j.id === query) return j;
        if (normalize(j.label_ko) === q) return j;
        if (normalize(j.label_en) === q) return j;
        for (const a of (j.aliases_ko || [])) {
            if (normalize(a) === q) return j;
        }
    }
    return null;
}

function suggestJobs(query) {
    if (!manifest || !manifest.jobs) return [];
    const q = normalize(query);
    if (!q) return manifest.jobs.slice(0, 8);
    const scored = [];
    for (const j of manifest.jobs) {
        const labels = [j.label_ko, j.label_en, ...(j.aliases_ko || [])].map(normalize);
        let score = 0;
        for (const lab of labels) {
            if (lab === q) score = Math.max(score, 100);
            else if (lab.startsWith(q)) score = Math.max(score, 60);
            else if (lab.includes(q)) score = Math.max(score, 30);
        }
        if (score > 0) scored.push({ j, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map(x => x.j);
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
        li.textContent = currentLang === "ko" ? j.label_ko : j.label_en;
        li.addEventListener("mousedown", (ev) => {
            ev.preventDefault();
            document.getElementById("job-input").value = li.textContent;
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

function showPhase(phase) {
    state.phase = phase;
    document.getElementById("input-section").classList.toggle("hidden", phase !== "job_select");
    document.getElementById("quiz-section").classList.toggle("hidden", phase !== "quiz");
    document.getElementById("result-section").classList.toggle("hidden", phase !== "result");
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
    startQuiz(entry.id);
}

function startQuiz(jobId) {
    state.jobId = jobId;
    state.answers = new Array((quiz.questions || []).length).fill(null);
    state.questionIdx = 0;
    state.persona = null;
    evolution = null;
    showPhase("quiz");
    renderQuestion();

    const url = new URL(window.location.href);
    url.searchParams.set("job", jobId);
    url.searchParams.delete("persona");
    history.replaceState(null, "", url);
}

function renderQuestion() {
    const idx = state.questionIdx;
    const total = (quiz.questions || []).length;
    if (idx >= total) {
        finalizeQuiz();
        return;
    }
    const q = quiz.questions[idx];
    const card = document.getElementById("quiz-card");
    const progress = t("quiz_progress").replace("{n}", idx + 1).replace("{total}", total);

    const text = q[currentLang] || q.ko;
    const opts = (q.options || []).map((o, i) => {
        const label = o[currentLang] || o.ko;
        return `<button type="button" class="quiz-option" data-value="${escapeHtml(o.value)}" data-idx="${i}">${escapeHtml(label)}</button>`;
    }).join("");

    card.innerHTML = `
        <div class="quiz-progress">${escapeHtml(progress)}</div>
        <h3 class="quiz-question">${escapeHtml(text)}</h3>
        <div class="quiz-options">${opts}</div>
    `;
    card.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", () => {
            state.answers[idx] = btn.getAttribute("data-value");
            state.questionIdx += 1;
            renderQuestion();
        });
    });
}

function calculatePersona() {
    let arSum = 0; // A=+1, R=-1
    let scSum = 0; // C=+1, S=-1
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
    const ar = arSum > 0 ? "A" : "R";  // 3 AR questions, can't tie at 0
    const sc = scSum > 0 ? "C" : "S";  // 2 SC questions, tie → S (solo)
    const code = ar + sc;
    return PERSONA_CODES.includes(code) ? code : "AS";
}

async function finalizeQuiz() {
    state.persona = calculatePersona();
    await goResult(state.jobId, state.persona);
}

async function goResult(jobId, personaCode) {
    state.jobId = jobId;
    state.persona = personaCode;
    showPhase("result");

    document.getElementById("result-loading").classList.remove("hidden");
    document.getElementById("result-content").classList.add("hidden");

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
    } catch (e) {
        console.error(e);
        alert(t("msg_no_match"));
        restartFlow();
    } finally {
        document.getElementById("result-loading").classList.add("hidden");
        document.getElementById("result-content").classList.remove("hidden");
    }
}

function renderResult() {
    const ev = evolution;
    if (!ev) return;
    const lang = currentLang;
    const code = state.persona;
    const persona = (ev.personas || {})[code] || {};
    const bias = persona.bias === "doom" ? "doom" : "bloom";

    // Header: nickname + blurb + bias hint
    const nickname = persona["nickname_" + lang] || persona.nickname_ko || code;
    const blurb = persona["blurb_" + lang] || persona.blurb_ko || "";
    const jobLabel = lang === "ko" ? ev.label_ko : ev.label_en;
    const hookCopy = (ev.hook_copy && ev.hook_copy[bias] && ev.hook_copy[bias][lang]) || "";

    document.getElementById("result-job-name").textContent = jobLabel;
    document.getElementById("persona-nickname").textContent = nickname;
    document.getElementById("persona-blurb").textContent = blurb;
    document.getElementById("persona-bias-path").textContent =
        bias === "doom" ? t("path_doom_title") : t("path_bloom_title");
    document.getElementById("hook-copy").textContent = hookCopy;

    // Dual tree
    const year0 = ev.year0 || {};
    const bloomStages = ((ev.paths && ev.paths.bloom && ev.paths.bloom.stages) || []).slice().sort((a, b) => a.year - b.year);
    const doomStages = ((ev.paths && ev.paths.doom && ev.paths.doom.stages) || []).slice().sort((a, b) => a.year - b.year);

    const year0Card = document.getElementById("year0-card");
    year0Card.innerHTML = renderStageCardInner(year0, 0, "year0");

    const bloomTree = document.getElementById("bloom-tree");
    bloomTree.innerHTML = bloomStages.map(s => `<div class="evo-card stage-${s.year} path-bloom">${renderStageCardInner(s, s.year, "bloom")}</div>`).join("");
    document.getElementById("bloom-tree-wrap").classList.toggle("path-bias", bias === "bloom");
    document.getElementById("bloom-tree-title").textContent = t("path_bloom_title");
    document.getElementById("bloom-tree-desc").textContent = t("path_bloom_desc");

    const doomTree = document.getElementById("doom-tree");
    doomTree.innerHTML = doomStages.map(s => `<div class="evo-card stage-${s.year} path-doom">${renderStageCardInner(s, s.year, "doom")}</div>`).join("");
    document.getElementById("doom-tree-wrap").classList.toggle("path-bias", bias === "doom");
    document.getElementById("doom-tree-title").textContent = t("path_doom_title");
    document.getElementById("doom-tree-desc").textContent = t("path_doom_desc");
}

function renderStageCardInner(stage, year, pathKey) {
    const lang = currentLang;
    const sl = (stage && stage[lang]) || (stage && stage.ko) || (stage && stage.en) || {};
    const skills = Array.isArray(sl.skills) ? sl.skills : [];
    let imgFile;
    if (pathKey === "year0") imgFile = "stage_0.webp";
    else if (pathKey === "bloom") imgFile = `bloom_${year}.webp`;
    else if (pathKey === "doom") imgFile = `doom_${year}.webp`;
    else imgFile = stage.image || `stage_${year}.webp`;
    const imgSrc = `${DATA_BASE}/jobs/${state.jobId}/${imgFile}`;
    const yearLabel = year === 0 ? t("year_now") : year === 10 ? t("year_10") : t("year_30");
    return `
        <div class="evo-card-year">${escapeHtml(yearLabel)}</div>
        <div class="evo-card-img-wrap">
            <img class="evo-card-img" src="${imgSrc}" alt="${escapeHtml(sl.title || "")}"
                 onerror="this.onerror=null; this.classList.add('img-missing'); this.removeAttribute('src');">
        </div>
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

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function restartFlow() {
    state = { phase: "job_select", jobId: null, answers: [], questionIdx: 0, persona: null };
    evolution = null;
    showPhase("job_select");
    const url = new URL(window.location.href);
    url.searchParams.delete("job");
    url.searchParams.delete("persona");
    history.replaceState(null, "", url);
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

    const lang = currentLang;
    const caption = (evolution.share_caption && evolution.share_caption[lang]) || t("slogan");
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
