// 1Day1Doom — single-page dual-path × persona diagnostic.
//
// Layout: one HTML page with three vertically-stacked sections that reveal
// progressively as the user fills in their job and answers all 5 quiz questions.
// Deep-link `?job=<id>&persona=<code>` skips the form and renders the result only.

const UI_TEXT = {
    ko: {
        app_title: "1Day1Doom",
        slogan: "AI가 내 직업을 잡아먹을까? 5문항으로 보는 30년 두 갈래 운명",
        input_title: "직업을 알려주세요",
        label_job: "직업",
        placeholder_job: "예: 백엔드 개발자, 교사, 간호사…",
        hint: "직업을 고르면 5문항이 떠요. 다 답하면 바로 결과를 볼 수 있어요.",
        btn_share: "결과 공유하기",
        btn_other_persona: "다른 페르소나 보기",
        btn_restart_quiz: "다른 직업으로 다시 하기",
        result_job_label: "내 직업",
        msg_share_done: "링크를 복사했어요. 어디든 붙여넣어 보세요!",
        msg_no_match: "아직 준비 안 된 직업이에요. 비슷한 직업으로 골라 주세요.",
        year_now: "지금",
        year_10: "10년 후",
        year_30: "30년 후",
        skills_label: "핵심 역량",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AI에게 자리를 내주는 길",
        path_bloom_desc: "AI와 함께 진화하는 길",
        bias_label: "지금 성향의 도착지",
        quiz_intro: "AI 시대, 당신은 어디쯤 서 있나요?",
        persona_card_title: "당신의 부캐",
        quiz_title: "5문항으로 진단하기",
        your_path_badge: "당신의 길",
        other_path_label: "다른 선택",
        agency_note: "이 길은 지금 성향의 도착지일 뿐이에요. 오늘부터의 선택이 다시 그릴 수 있어요."
    },
    en: {
        app_title: "1Day1Doom",
        slogan: "Will AI eat my job? Find your 30-year split fate in 5 questions.",
        input_title: "What do you do?",
        label_job: "Job",
        placeholder_job: "e.g. Backend Developer, Teacher, Nurse…",
        hint: "Drop in your job, answer 5 quick questions, see your fate.",
        btn_share: "Share my fate",
        btn_other_persona: "Meet another you",
        btn_restart_quiz: "Try another job",
        result_job_label: "Your job",
        msg_share_done: "Link copied. Paste it anywhere.",
        msg_no_match: "Don't have that one yet — try a close cousin.",
        year_now: "Now",
        year_10: "10 years",
        year_30: "30 years",
        skills_label: "Key skills",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AI takes your seat",
        path_bloom_desc: "You evolve with AI",
        bias_label: "Where this leans today",
        quiz_intro: "In the age of AI, where do you stand?",
        persona_card_title: "Your alter-ego",
        quiz_title: "5-question diagnosis",
        your_path_badge: "Your path",
        other_path_label: "The other path",
        agency_note: "This is just where today's tendency leads. The choices you make from now on can redraw it."
    },
    ja: {
        app_title: "1Day1Doom",
        slogan: "AIに仕事を奪われる？ 5問で30年後の運命が二択に分かれる。",
        input_title: "まず、職業を教えてください",
        label_job: "職業",
        placeholder_job: "例：バックエンド開発者、教師、看護師…",
        hint: "職業を選んで5問に答えると、このページに結果が表示されます。",
        btn_share: "結果をシェアする",
        btn_other_persona: "他のペルソナも見てみる",
        btn_restart_quiz: "他の職業でやり直す",
        result_job_label: "あなたの職業",
        msg_share_done: "リンクをコピーしました。どこにでも貼り付けられます。",
        msg_no_match: "まだ用意できていません。近い職業を選んでください。",
        year_now: "今",
        year_10: "10年後",
        year_30: "30年後",
        skills_label: "コアスキル",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AIに席を譲る未来",
        path_bloom_desc: "AIと共に進化する未来",
        bias_label: "今の傾向の行き先",
        quiz_intro: "AI時代、あなたはどこに立っていますか？",
        persona_card_title: "あなたの分身",
        quiz_title: "5問診断",
        your_path_badge: "あなたの道",
        other_path_label: "別の道",
        agency_note: "これは今の傾向の行き先にすぎません。今日からの選択が、これを描き直せます。"
    },
    "zh-tw": {
        app_title: "1Day1Doom",
        slogan: "AI 會吃掉你的工作嗎？5 題，看見 30 年後的你",
        input_title: "你的職業是？",
        label_job: "職業",
        placeholder_job: "例如：後端工程師、老師、護理師⋯",
        hint: "選好職業、答完 5 題，結果會直接出現在同一頁。",
        btn_share: "分享我的結果",
        btn_other_persona: "看看其他分身",
        btn_restart_quiz: "換個職業再測",
        result_job_label: "你的職業",
        msg_share_done: "連結複製好了，貼到哪裡都能分享。",
        msg_no_match: "還沒收錄這個職業，挑一個相近的試試？",
        year_now: "現在",
        year_10: "10 年後",
        year_30: "30 年後",
        skills_label: "核心技能",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "AI 接手你位置的那條路",
        path_bloom_desc: "跟 AI 一起進化的那條路",
        bias_label: "你目前傾向的去向",
        quiz_intro: "AI 時代，你站在哪一邊？",
        persona_card_title: "你的分身",
        quiz_title: "5 題快測",
        your_path_badge: "你的這條路",
        other_path_label: "另一條路",
        agency_note: "這只是目前傾向的去向。從今天開始的選擇，能重新畫過。"
    },
    es: {
        app_title: "1Day1Doom",
        slogan: "¿La IA se comerá tu trabajo? Mira tus dos finales a 30 años — en 5 preguntas.",
        input_title: "Empezamos por tu trabajo",
        label_job: "Trabajo",
        placeholder_job: "p. ej. desarrollador backend, profesora, enfermero…",
        hint: "Pones tu trabajo, contestas 5 preguntas y ves el resultado aquí mismo.",
        btn_share: "Compartir mi resultado",
        btn_other_persona: "Ver otro alter ego",
        btn_restart_quiz: "Probar con otro trabajo",
        result_job_label: "Tu trabajo",
        msg_share_done: "Enlace copiado. Ya lo puedes pegar donde quieras.",
        msg_no_match: "Ese aún no lo tenemos. Prueba con uno parecido.",
        year_now: "Ahora",
        year_10: "10 años",
        year_30: "30 años",
        skills_label: "Habilidades clave",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "Cuando la IA se sienta en tu silla",
        path_bloom_desc: "Cuando evolucionas junto a la IA",
        bias_label: "Hacia donde te lleva esto",
        quiz_intro: "En la era de la IA, ¿de qué lado caes?",
        persona_card_title: "Tu alter ego",
        quiz_title: "5 preguntas, dos finales",
        your_path_badge: "Tu camino",
        other_path_label: "El otro camino",
        agency_note: "Esto es solo hacia donde te lleva la tendencia de hoy. Lo que elijas a partir de ahora puede reescribirlo."
    },
    de: {
        app_title: "1Day1Doom",
        slogan: "Frisst KI deinen Job? — 5 Fragen, 30 Jahre Zukunft.",
        input_title: "Was machst du beruflich?",
        label_job: "Beruf",
        placeholder_job: "z. B. Backend-Entwickler, Lehrerin, Pfleger…",
        hint: "5 Fragen, dein Ergebnis sofort darunter. Kein Scrollen ins Nirgendwo.",
        btn_share: "Teilen",
        btn_other_persona: "Andere Persona zeigen",
        btn_restart_quiz: "Nochmal, anderer Beruf",
        result_job_label: "Dein Beruf",
        msg_share_done: "Link kopiert. Ab damit.",
        msg_no_match: "Den kennen wir noch nicht — nimm was Ähnliches.",
        year_now: "Jetzt",
        year_10: "in 10 Jahren",
        year_30: "in 30 Jahren",
        skills_label: "Kernkompetenzen",
        path_doom_title: "DOOM PATH",
        path_bloom_title: "BLOOM PATH",
        path_doom_desc: "KI übernimmt deinen Platz",
        path_bloom_desc: "Du wächst mit der KI",
        bias_label: "Wohin das gerade tendiert",
        quiz_intro: "Im KI-Zeitalter — wo stehst du?",
        persona_card_title: "Dein Alter Ego",
        quiz_title: "Die 5-Fragen-Diagnose",
        your_path_badge: "Dein Weg",
        other_path_label: "Der andere Weg",
        agency_note: "Das ist nur, wohin es gerade tendiert. Was du ab heute entscheidest, kann es neu zeichnen."
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

    setupLangSwitch();

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
        const hot = manifest.jobs.filter(j => j.hot);
        const cold = manifest.jobs.filter(j => !j.hot);
        manifest.jobs = [...shuffle(hot), ...shuffle(cold)];
    } catch (e) {
        console.error("Failed to load manifest:", e);
        manifest = { jobs: [] };
    }
}

function setupLangSwitch() {
    const wrap = document.getElementById("lang-switch");
    if (!wrap) return;
    const toggle = wrap.querySelector(".lang-toggle");
    const menu = wrap.querySelector(".lang-menu");
    if (!toggle || !menu) return;
    const close = () => {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
        menu.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    };
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menu.hidden) open(); else close();
    });
    document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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
        const hotBadge = j.hot ? `<span class="suggest-hot" aria-label="hot">🔥</span>` : "";
        li.innerHTML = `<span class="suggest-emoji">${escapeHtml(j.emoji || "✨")}</span> <span class="suggest-label">${escapeHtml(jobLabel(j))}</span>${hotBadge}`;
        if (j.hot) li.classList.add("is-hot");
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

    renderPathBadges(bias);
}

function renderPathBadges(bias) {
    document.querySelectorAll(".path-tree-badge").forEach(el => el.remove());
    const biasWrap = document.getElementById(bias === "doom" ? "doom-tree-wrap" : "bloom-tree-wrap");
    const otherWrap = document.getElementById(bias === "doom" ? "bloom-tree-wrap" : "doom-tree-wrap");
    if (biasWrap) {
        const badge = document.createElement("span");
        badge.className = "path-tree-badge";
        badge.textContent = t("your_path_badge");
        biasWrap.appendChild(badge);
    }
    if (otherWrap) {
        const altBadge = document.createElement("span");
        altBadge.className = "path-tree-badge path-tree-badge-alt";
        altBadge.textContent = t("other_path_label");
        otherWrap.appendChild(altBadge);
    }
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
