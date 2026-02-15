const CONFIG = {
    repoUrl: 'https://wwtrembling.github.io/1day1doom' // Placeholder
};

const UI_TEXT = {
    ko: {
        app_title: "1일 1멸망 🧟",
        input_title: "생존자 등록",
        label_name: "이름",
        label_age: "나이",
        label_job_cat: "직군",
        cat_office: "사무직/IT",
        cat_service: "서비스/자영업",
        cat_professional: "전문직/의료",
        cat_labor: "현장/운동",
        cat_art: "예술/방송",
        cat_student: "학생",
        cat_influencer: "인플루언서",
        cat_rich: "금수저/경영",
        cat_gamer: "게이머/해커",
        cat_home: "무직/백수",
        btn_submit: "미래 확인하기",
        btn_retry: "다시 하기",
        btn_share: "공유하기",
        slogan: "오늘의 멸망을 배달해드립니다.",
        msg_calculating: "멸망 시나리오 생성 중...",
        msg_wait: "당신의 미래를 불러오고 있습니다. 잠시만 기다려주세요.",
        msg_share_done: "미래가 복사되었습니다! 친구들에게 경고하세요."
    },
    en: {
        app_title: "1 Day 1 Doom 🧟",
        input_title: "Survivor Registration",
        label_name: "Name",
        label_age: "Age",
        label_job_cat: "Category",
        cat_office: "Office/IT",
        cat_service: "Service/Retail",
        cat_professional: "Professional/Medical",
        cat_labor: "Labor/Sports",
        cat_art: "Art/Media",
        cat_student: "Student",
        cat_influencer: "Influencer",
        cat_rich: "Rich/Executive",
        cat_gamer: "Gamer/Hacker",
        cat_home: "Unemployed",
        btn_submit: "Check Future",
        btn_retry: "Try Again",
        btn_share: "Share",
        slogan: "Your Daily Dose of Dystopia.",
        msg_calculating: "Generating Scenario...",
        msg_wait: "Loading your future. Please wait a moment.",
        msg_share_done: "Future copied! Warn your friends."
    }
};

let currentLang = 'ko';
let currentThemeData = null; // Stores scenario.json data
let currentJobData = null;   // Stores {job}_data.json data

let scenarios = [];

function updateLanguage(lang) {
    currentLang = lang;

    // Update active button
    document.getElementById('btn-ko').classList.toggle('active', lang === 'ko');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    // Update all data-i18n elements
    const texts = UI_TEXT[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = texts[key];
            } else {
                el.textContent = texts[key];
            }
        }
    });

    // Update slogan
    document.getElementById('slogan').textContent = texts.slogan;

    // Re-render result if visible
    if (currentJobData && !document.getElementById('result-section').classList.contains('hidden')) {
        renderResultContent();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Detect Language from HTML tag
    const htmlLang = document.documentElement.lang;
    if (htmlLang === 'en') {
        currentLang = 'en';
    } else {
        currentLang = 'ko';
    }
    updateLanguage(currentLang);

    // 2. Event Listeners
    // Language buttons are now links, so no click listeners needed

    document.getElementById('survival-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-restart').addEventListener('click', resetForm);
    document.getElementById('btn-share').addEventListener('click', shareResult);

    // 3. Load Scenarios List
    await fetchScenarioList();

    // 4. Random job selection (default)
    const jobSelect = document.getElementById('job-category');
    const options = jobSelect.querySelectorAll('option');
    jobSelect.selectedIndex = Math.floor(Math.random() * options.length);

    // 5. Load Saved Data (overrides random if exists)
    loadUserData();

    // 5. Check Deep Link
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get('name');
    const pAge = urlParams.get('age');
    const pJob = urlParams.get('job');
    const pScenario = urlParams.get('s'); // s=s1, s2 etc.

    if (pName && pAge && pJob) {
        // Auto-fill form
        document.getElementById('name').value = pName;
        document.getElementById('age').value = pAge;
        document.getElementById('job-category').value = pJob;

        // Auto-show result
        try {
            // Determine which scenario to load
            let scenarioToLoad = pScenario;
            if (!scenarioToLoad) {
                // If no specific scenario in link, use the rotation logic or default to latest
                // effectively acting like a new submission but skipping the click
                scenarioToLoad = getNextScenario(pJob);
            }

            await loadScenarioData(scenarioToLoad, pJob);

            if (currentJobData) {
                // Hide Input, Show Result directly
                document.getElementById('input-section').classList.add('hidden');
                document.getElementById('loading-section').classList.add('hidden');

                renderResultContent();

                document.getElementById('result-section').classList.remove('hidden');
            }
        } catch (e) {
            console.error("Deep link render failed:", e);
            document.getElementById('input-section').classList.remove('hidden');
        }
    }
});

async function fetchScenarioList() {
    try {
        const response = await fetch('../public/data/scenarios.json');
        if (!response.ok) throw new Error("Failed to load scenarios.json");
        scenarios = await response.json();
        console.log("Loaded scenarios:", scenarios);
    } catch (e) {
        console.error("Error loading scenarios:", e);
        // Fallback or Alert?
        scenarios = ['s1']; // Minimal fallback
    }
}

function getNextScenario(jobCat) {
    if (!scenarios || scenarios.length === 0) return 's1';

    // 1. Get history from LocalStorage
    // Key: odod_scenario_history (JSON object: { "office": "s3", "gamer": "s1" ... })
    let history = {};
    const savedHistory = localStorage.getItem('odod_scenario_history');
    if (savedHistory) {
        try { history = JSON.parse(savedHistory); } catch (e) { }
    }

    const lastSeen = history[jobCat];

    // Logic: Latest -> ... -> First -> Latest
    // Sort scenarios purely to establish order? Assuming scenarios.json is ordered [s1, s2, s3...].
    // If not, we might want to sort them. Let's assume they are sorted or we rely on the list order.
    // Latest = last element.

    let nextScenario = '';

    if (!lastSeen) {
        // First time for this job: Show Latest
        nextScenario = scenarios[scenarios.length - 1];
    } else {
        // Find index of last seen
        const lastIndex = scenarios.indexOf(lastSeen);
        if (lastIndex === -1) {
            // Unknown scenario (maybe deleted), reset to Latest
            nextScenario = scenarios[scenarios.length - 1];
        } else {
            // Previous index
            let nextIndex = lastIndex - 1;
            if (nextIndex < 0) {
                // Wrap to Latest (End of array)
                nextIndex = scenarios.length - 1;
            }
            nextScenario = scenarios[nextIndex];
        }
    }

    // Save decision implies we "viewed" it? 
    // Actually, we should probably save it when we actually render or just here.
    // Let's save here because this function determines what WE WILL SHOW.
    history[jobCat] = nextScenario;
    localStorage.setItem('odod_scenario_history', JSON.stringify(history));

    return nextScenario;
}

async function loadScenarioData(scenarioId, jobCat) {
    console.log(`Loading scenario: ${scenarioId} for job: ${jobCat}`);
    try {
        // 1. Load Master Scenario (Theme) - Cache if possible or just fetch
        // We could optimize to not fetch if already loaded for same scenarioId
        if (!currentThemeData || currentThemeData.meta.scenario_id !== scenarioId) {
            const themeUrl = `../public/data/${scenarioId}/scenario.json`;
            const themeRes = await fetch(themeUrl);
            if (!themeRes.ok) throw new Error(`Theme data not found for ${scenarioId}`);
            currentThemeData = await themeRes.json();
            // Ensure meta has scenario_id if missing (legacy support)
            if (!currentThemeData.meta.scenario_id) currentThemeData.meta.scenario_id = scenarioId;
        }

        // 2. Load Job Data
        const jobUrl = `../public/data/${scenarioId}/${jobCat}_data.json`;
        const jobRes = await fetch(jobUrl);
        if (!jobRes.ok) throw new Error(`Job data not found for ${scenarioId} / ${jobCat}`);

        currentJobData = await jobRes.json();

        // Setup helper paths
        currentJobData._basePath = `../public/data/${scenarioId}/`;
        currentJobData.id = scenarioId;

        updateSEO();
        return true;
    } catch (e) {
        console.error("Failed to load scenario data:", e);
        alert(`데이터를 불러올 수 없습니다: ${scenarioId} (${jobCat})`);
        return false;
    }
}

function updateSEO() {
    if (!currentThemeData) return;
    const content = currentThemeData.content[currentLang] || currentThemeData.content; // Fallback structure
    const desc = content.theme_desc;


    document.querySelector('meta[name="description"]').setAttribute("content", desc);
    document.querySelector('meta[property="og:description"]').setAttribute("content", desc);
    document.title = UI_TEXT[currentLang].slogan;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // 1. Determine next scenario
    const jobCat = document.getElementById('job-category').value;
    const nextScenario = getNextScenario(jobCat);

    try {
        // 2. Save Data
        saveUserData();

        // 3. Hide Input, Show Loading
        document.getElementById('input-section').classList.add('hidden');
        document.getElementById('loading-section').classList.remove('hidden');

        // 4. Preload Data while waiting
        await loadScenarioData(nextScenario, jobCat);

        // 5. Wait 3 seconds for effect
        setTimeout(() => {
            try {
                if (!currentJobData) {
                    throw new Error("Scenario data not loaded");
                }

                // 6. Hide Loading, Show Result
                document.getElementById('loading-section').classList.add('hidden');
                renderResultContent();
                document.getElementById('result-section').classList.remove('hidden');
            } catch (err) {
                console.error("Error rendering result:", err);
                alert("결과를 표시하는 중 오류가 발생했습니다: " + err.message);
                document.getElementById('input-section').classList.remove('hidden');
            }
        }, 3000);
    } catch (err) {
        console.error("Error in form submission:", err);
        alert("오류가 발생했습니다: " + err.message);
        document.getElementById('input-section').classList.remove('hidden');
    }
}

function saveUserData() {
    const userData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        jobCat: document.getElementById('job-category').value
    };
    localStorage.setItem('odod_user_data', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('odod_user_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.name) document.getElementById('name').value = data.name;
            if (data.age) document.getElementById('age').value = data.age;
            // gender removed
            if (data.jobCat) document.getElementById('job-category').value = data.jobCat;
        } catch (e) {
            console.error("Failed to load saved data", e);
        }
    }
}

function renderResultContent() {
    // Get Inputs
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const jobCat = document.getElementById('job-category').value;

    // Check if element exists
    const optionEl = document.querySelector(`#job-category option[value="${jobCat}"]`);
    if (!optionEl) {
        throw new Error(`직군 선택을 찾을 수 없습니다: ${jobCat}`);
    }
    const jobCatText = optionEl.textContent;

    if (!currentJobData || !currentThemeData) {
        throw new Error("데이터가 로드되지 않았습니다.");
    }

    // Theme Info from currentThemeData
    const themeContent = currentThemeData.content[currentLang] || currentThemeData.content;
    if (!themeContent) throw new Error(`테마 데이터 오류: ${currentLang}`);

    // Job Info from currentJobData
    // Note: currentJobData might still have content.ko.scenarios OR it might rely on us merging?
    // In our generator/conversion, we stuck with structure: jobData.content.ko.scenarios...
    // But themes are also in jobData currently (duplicates).
    // We should prefer currentThemeData for Title/Desc, and currentJobData for Scenarios.

    const jobContent = currentJobData.content[currentLang] || currentJobData.content;

    // 1. Text Content
    document.getElementById('theme-title').textContent = themeContent.theme_title;
    document.getElementById('theme-desc').textContent = themeContent.theme_desc;

    // genderText removed

    const processScenario = (text) => {
        return text
            .replace(/\$\{name\}/g, name)
            .replace(/\{\{name\}\}/g, name)
            .replace(/\$\{age\}/g, age)
            .replace(/\{\{age\}\}/g, age)
            .replace(/\$\{job\}/g, jobCatText)
            .replace(/\{\{job\}\}/g, jobCatText);
    };

    document.getElementById('text-10y').textContent = processScenario(jobContent.scenarios['10y']);
    document.getElementById('text-20y').textContent = processScenario(jobContent.scenarios['20y']);
    document.getElementById('text-30y').textContent = processScenario(jobContent.scenarios['30y']);

    // 2. Image
    // Key: office, gamer etc.
    const imgKey = jobCat;
    const imgSrc = currentJobData.archetypes[imgKey];
    const imgEl = document.getElementById('result-image');
    const imgContainer = imgEl.closest('.image-container');

    if (imgSrc) {
        // Resolve relative path if needed
        let finalSrc = imgSrc;
        if (imgSrc.startsWith('./') && currentJobData._basePath) {
            finalSrc = currentJobData._basePath + imgSrc.substring(2);
        }
        imgEl.src = finalSrc;
        if (imgContainer) imgContainer.style.display = '';
    } else {
        imgEl.src = '';
        if (imgContainer) imgContainer.style.display = 'none';
    }
}

async function shareResult() {
    let shareUrl = window.location.href;

    // Clean existing search params to avoid duplication
    const urlObj = new URL(window.location.href);

    // 1. Scenario Param
    if (currentJobData && currentJobData.id) {
        urlObj.searchParams.set('s', currentJobData.id);
    }

    // 2. User Params (Deep Linking)
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const jobCat = document.getElementById('job-category').value;

    if (name) urlObj.searchParams.set('name', name);
    if (age) urlObj.searchParams.set('age', age);
    // gender removed
    if (jobCat) urlObj.searchParams.set('job', jobCat);

    shareUrl = urlObj.toString();

    const text = UI_TEXT[currentLang].slogan + "\n\n" +
        document.getElementById('theme-title').textContent + "\n" +
        document.getElementById('theme-desc').textContent + "\n\n" +
        shareUrl;

    if (navigator.share) {
        try {
            await navigator.share({
                title: document.title,
                text: text,
                url: shareUrl,
            });
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        // Fallback: Copy to clipboard
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Legacy fallback for insecure contexts (HTTP)
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            alert(UI_TEXT[currentLang].msg_share_done);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }
}

function resetForm() {
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('input-section').classList.remove('hidden');
}



