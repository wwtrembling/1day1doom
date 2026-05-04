// 1day1evolve — Career Evolution Tree client
//
// Loads ../public/data/jobs.json (manifest), then loads
// ../public/data/jobs/{id}/evolution.json on demand and renders
// 3 evolution cards. Supports ?job=<id> deep links and clipboard share.

const UI_TEXT = {
    ko: {
        app_title: "1일 1진화",
        slogan: "AI가 내 직업을 먹기 전에, 내가 먼저 진화한다.",
        input_title: "내 직업 입력",
        label_job: "직업",
        placeholder_job: "예: 백엔드 개발자, 교사, 간호사…",
        hint: "내 직업이 30년 동안 어떻게 진화할지, AI 시대에 어떻게 살아남을지 보여드려요.",
        btn_submit: "진화 트리 보기",
        btn_retry: "다른 직업으로",
        btn_share: "친구에게 공유",
        result_job_label: "내 직업",
        msg_calculating: "진화 트리 분석 중…",
        msg_share_done: "링크가 복사되었어요. 친구에게 자랑해보세요!",
        msg_no_match: "아직 준비된 직업 카드가 없어요. 비슷한 직업으로 시도해 보세요.",
        year_now: "지금",
        year_10: "10년 후",
        year_30: "30년 후",
        skills_label: "핵심 역량"
    },
    en: {
        app_title: "1 Day 1 Evolve",
        slogan: "Before AI eats your job, evolve first.",
        input_title: "Your Job",
        label_job: "Job",
        placeholder_job: "e.g. Backend Developer, Teacher, Nurse…",
        hint: "See how your career evolves over 30 years and how to thrive in the age of AI.",
        btn_submit: "See My Evolution Tree",
        btn_retry: "Try Another Job",
        btn_share: "Share",
        result_job_label: "Your job",
        msg_calculating: "Analyzing your evolution tree…",
        msg_share_done: "Link copied! Share with friends.",
        msg_no_match: "We don't have a card for that job yet. Try a similar one.",
        year_now: "Now",
        year_10: "10 years",
        year_30: "30 years",
        skills_label: "Key skills"
    }
};

const DATA_BASE = "../public/data";

let currentLang = "ko";
let manifest = null;
let currentEvolution = null;

function t(key) {
    return UI_TEXT[currentLang][key] || key;
}

document.addEventListener("DOMContentLoaded", async () => {
    currentLang = document.documentElement.lang === "en" ? "en" : "ko";
    applyI18n();

    document.getElementById("job-form").addEventListener("submit", onFormSubmit);
    document.getElementById("btn-restart").addEventListener("click", resetView);
    document.getElementById("btn-share").addEventListener("click", onShare);

    const input = document.getElementById("job-input");
    input.addEventListener("input", onInputChange);
    input.addEventListener("focus", onInputChange);
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".form-group")) hideSuggestions();
    });

    await loadManifest();

    const params = new URLSearchParams(window.location.search);
    const deepJob = params.get("job");
    if (deepJob) {
        const entry = findJob(deepJob);
        if (entry) {
            input.value = currentLang === "ko" ? entry.label_ko : entry.label_en;
            await showEvolution(entry.id);
        }
    } else {
        const saved = localStorage.getItem("evo_last_input");
        if (saved) input.value = saved;
    }
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

async function onFormSubmit(e) {
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
    await showEvolution(entry.id);
}

async function showEvolution(jobId) {
    document.getElementById("input-section").classList.add("hidden");
    document.getElementById("result-section").classList.add("hidden");
    document.getElementById("loading-section").classList.remove("hidden");

    try {
        const res = await fetch(`${DATA_BASE}/jobs/${jobId}/evolution.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("evolution fetch failed");
        currentEvolution = await res.json();
        currentEvolution._jobId = jobId;

        // small delay so the loading state is perceptible
        await new Promise(r => setTimeout(r, 600));

        renderResult();

        const url = new URL(window.location.href);
        url.searchParams.set("job", jobId);
        history.replaceState(null, "", url);
    } catch (e) {
        console.error(e);
        alert(t("msg_no_match"));
        resetView();
    } finally {
        document.getElementById("loading-section").classList.add("hidden");
    }
}

function renderResult() {
    const ev = currentEvolution;
    const lang = currentLang;
    if (!ev) return;

    document.getElementById("result-job-name").textContent =
        lang === "ko" ? ev.label_ko : ev.label_en;
    document.getElementById("result-caption").textContent =
        (ev.share_caption && ev.share_caption[lang]) || "";

    const container = document.getElementById("evolution-cards");
    container.innerHTML = "";

    const stages = (ev.stages || []).slice().sort((a, b) => a.year - b.year);

    stages.forEach((stage, idx) => {
        const card = document.createElement("div");
        card.className = `evo-card stage-${stage.year}`;

        const yearLabel =
            stage.year === 0 ? t("year_now") :
            stage.year === 10 ? t("year_10") :
            t("year_30");

        const sl = stage[lang] || stage.ko || stage.en || {};
        const skills = Array.isArray(sl.skills) ? sl.skills : [];
        const imgFile = stage.image || `stage_${stage.year}.webp`;
        const imgSrc = `${DATA_BASE}/jobs/${ev._jobId}/${imgFile}`;

        card.innerHTML = `
            <div class="evo-card-year">${yearLabel}</div>
            <div class="evo-card-img-wrap">
                <img class="evo-card-img" src="${imgSrc}" alt="${sl.title || ""}"
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

        container.appendChild(card);
        if (idx < stages.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "evo-arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
        }
    });

    document.getElementById("result-section").classList.remove("hidden");
    document.getElementById("input-section").classList.add("hidden");
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function resetView() {
    document.getElementById("result-section").classList.add("hidden");
    document.getElementById("loading-section").classList.add("hidden");
    document.getElementById("input-section").classList.remove("hidden");
    const url = new URL(window.location.href);
    url.searchParams.delete("job");
    history.replaceState(null, "", url);
}

async function onShare() {
    if (!currentEvolution) return;
    const url = new URL(window.location.href);
    url.searchParams.set("job", currentEvolution._jobId);
    const shareUrl = url.toString();

    const lang = currentLang;
    const text =
        ((currentEvolution.share_caption && currentEvolution.share_caption[lang]) || t("slogan"))
        + "\n\n" + shareUrl;

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
