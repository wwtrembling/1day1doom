const CONFIG = {
    repoUrl: 'https://wwtrembling.github.io/1day1doom' // Placeholder
};

const UI_TEXT = {
    ko: {
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
let dailyData = null;

// Initialize
// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Detect Language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.toLowerCase().startsWith('en')) {
        currentLang = 'en';
    }
    updateLanguage(currentLang);

    // 2. Event Listeners
    document.getElementById('btn-ko').addEventListener('click', () => updateLanguage('ko'));
    document.getElementById('btn-en').addEventListener('click', () => updateLanguage('en'));

    document.getElementById('survival-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-restart').addEventListener('click', resetForm);
    document.getElementById('btn-share').addEventListener('click', shareResult);

    // 3. Load Saved Data (Prior to Deep Link check)
    loadUserData();

    // 4. Fetch Data & Check Deep Link
    await fetchDailyData(); // This sets 'dailyData'

    // Check for Deep Link Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get('name');
    const pAge = urlParams.get('age');
    const pGender = urlParams.get('gender');
    const pJob = urlParams.get('job');

    if (pName && pAge && pJob) {
        // Auto-fill form
        document.getElementById('name').value = pName;
        document.getElementById('age').value = pAge;

        // gender removed

        document.getElementById('job-category').value = pJob;

        // Auto-show result (skip loading animation for instant deep link view)
        if (dailyData) {
            try {
                // Hide Input, Show Result directly
                document.getElementById('input-section').classList.add('hidden');
                document.getElementById('loading-section').classList.add('hidden'); // Ensure loading is hidden

                renderResultContent();

                document.getElementById('result-section').classList.remove('hidden');
            } catch (e) {
                console.error("Deep link render failed:", e);
                // Fallback to input
                document.getElementById('input-section').classList.remove('hidden');
            }
        }
    }
});

function updateLanguage(lang) {
    currentLang = lang;

    // Toggle Buttons
    document.getElementById('btn-ko').classList.toggle('active', lang === 'ko');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    // Update UI Text
    const texts = UI_TEXT[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) el.textContent = texts[key];
    });

    document.getElementById('slogan').textContent = texts.slogan;

    // Update Result View if data is already loaded and visible
    if (!document.getElementById('result-section').classList.contains('hidden') && dailyData) {
        renderResultContent();
    }
}

async function fetchDailyData() {
    const today = new Date();
    // Format YYYY-Www in local time
    const todayStr = getISOWeekStr(today);

    // check URL param
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');

    let targetDate = dateParam;

    if (!targetDate) {
        // Dynamic Date Loading via weekOfYear.js
        try {
            const weekRes = await fetch('./public/data/weekOfYear.js?t=' + new Date().getTime()); // bust cache
            if (weekRes.ok) {
                const availableWeeks = await weekRes.json();

                if (Array.isArray(availableWeeks) && availableWeeks.length > 0) {
                    // Check if todayStr is in the list
                    if (availableWeeks.includes(todayStr)) {
                        targetDate = todayStr;
                        console.log(`Using current week data: ${targetDate}`);
                    } else {
                        // Fallback to random week
                        const randomIndex = Math.floor(Math.random() * availableWeeks.length);
                        targetDate = availableWeeks[randomIndex];
                        console.log(`Current week data missing. Fallback to random week: ${targetDate}`);
                    }
                }
            }
        } catch (e) {
            console.warn("Failed to fetch weekOfYear.js", e);
        }
    }

    // Fallback if still null
    if (!targetDate) {
        targetDate = todayStr; // Try original today again (will likely fail 404 but correct behavior for "no data yet")
        console.log(`Fallback to today's week (likely 404): ${targetDate}`);
    }

    // Path: ./public/data/{date}/data.json
    // Note: If index.html is in web-client root, then public folder is ./public
    const url = `./public/data/${targetDate}/data.json`;
    const basePath = `./public/data/${targetDate}/`;

    if (dateParam) {
        console.log(`Fetching historical data: ${dateParam}`);
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Data not found for ${targetDate}`);
        dailyData = await response.json();
        dailyData._basePath = basePath; // Helper for images
        dailyData.meta.date = targetDate; // Ensure meta date matches

        // Update SEO
        updateSEO();
    } catch (e) {
        console.error("Failed to load daily data:", e);

        if (dateParam) {
            alert(`해당 날짜(${targetDate})의 멸망 데이터가 없습니다. 메인으로 이동합니다.`);
            window.location.search = '';
        } else {
            alert(`오늘(${targetDate})의 멸망 데이터가 아직 도착하지 않았습니다.`);
        }
    }
}

function updateSEO() {
    if (!dailyData) return;
    const meta = dailyData.meta;
    const desc = dailyData.content[currentLang].theme_desc;

    document.querySelector('meta[name="description"]').setAttribute("content", desc);
    document.querySelector('meta[property="og:description"]').setAttribute("content", desc);
    document.title = UI_TEXT[currentLang].slogan;
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted. DailyData:", dailyData);
    if (!dailyData) {
        alert("오늘의 멸망 데이터를 불러오는 중입니다. 잠시만 기다려주세요.");
        return;
    }

    try {
        // 1. Save Data
        saveUserData();

        // 2. Hide Input, Show Loading
        document.getElementById('input-section').classList.add('hidden');
        document.getElementById('loading-section').classList.remove('hidden');

        // 3. Wait 5 seconds
        setTimeout(() => {
            try {
                // 4. Hide Loading, Show Result
                document.getElementById('loading-section').classList.add('hidden');
                renderResultContent();
                document.getElementById('result-section').classList.remove('hidden');
            } catch (err) {
                console.error("Error rendering result:", err);
                alert("결과를 표시하는 중 오류가 발생했습니다: " + err.message);
                // Show input again so they aren't stuck
                document.getElementById('input-section').classList.remove('hidden');
            }
        }, 5000); // 5000ms = 5 seconds
    } catch (err) {
        console.error("Error in form submission:", err);
        alert("오류가 발생했습니다: " + err.message);
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

    if (!dailyData || !dailyData.content) {
        throw new Error("데이터가 로드되지 않았습니다.");
    }

    const content = dailyData.content[currentLang];
    if (!content) {
        throw new Error(`언어 데이터가 없습니다: ${currentLang}`);
    }

    // 1. Text Content
    document.getElementById('theme-title').textContent = content.theme_title;
    document.getElementById('theme-desc').textContent = content.theme_desc;

    // genderText removed

    const processScenario = (text) => {
        return text
            .replace(/\$\{name\}/g, name)
            .replace(/\{\{name\}\}/g, name)
            .replace(/\$\{age\}/g, age)
            .replace(/\{\{age\}\}/g, age)
            .replace(/\$\{job\}/g, jobCatText)
            .replace(/\{\{job\}\}/g, jobCatText);
        // gender replaced logic removed
    };

    document.getElementById('text-10y').textContent = processScenario(content.scenarios['10y']);
    document.getElementById('text-20y').textContent = processScenario(content.scenarios['20y']);
    document.getElementById('text-30y').textContent = processScenario(content.scenarios['30y']);

    // 2. Image
    // Key: office, gamer etc.
    const imgKey = jobCat;
    const imgSrc = dailyData.archetypes[imgKey];

    if (imgSrc) {
        // Resolve relative path if needed
        let finalSrc = imgSrc;
        if (imgSrc.startsWith('./') && dailyData._basePath) {
            finalSrc = dailyData._basePath + imgSrc.substring(2);
        }
        document.getElementById('result-image').src = finalSrc;
    }
}

async function shareResult() {
    let shareUrl = window.location.href;

    // Clean existing search params to avoid duplication
    const urlObj = new URL(window.location.href);

    // 1. Date Param
    if (dailyData && dailyData.meta && dailyData.meta.date) {
        urlObj.searchParams.set('date', dailyData.meta.date);
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
            await navigator.clipboard.writeText(text);
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


function getISOWeekStr(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return format YYYY-Www
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
