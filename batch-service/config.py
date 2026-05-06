# 직업 진화 트리 — 한국 2030 사용자가 자기 직업을 즉시 매칭할 수 있도록
# 자주 쓰이는 직업을 폭넓게 커버한다.
#
# 각 항목 스키마:
#   id              — 디렉터리/URL 슬러그용 (영문, snake_case)
#   label_ko        — 한국어 표기 (검색 자동완성에 노출)
#   label_en        — 영문 표기
#   description_en  — LLM에 직업 맥락 전달용 영문 설명 (1문장)
#   aliases_ko      — 사용자 자유 입력을 매칭하기 위한 한국어 별칭들
#   character_seed  — Imagen 일러스트 캐릭터 정체성 (3단 진화 동안 고정)
#   composition     — 단계별 구도 디렉티브 (year_0 / year_10 / year_30)
#
# generator.py 가 이 카탈로그를 순회해 30개 직업의 진화 트리를 사전 생성한다.

JOB_CATALOG = [
    {
        "id": "backend_developer",
        "label_ko": "백엔드 개발자",
        "label_en": "Backend Developer",
        "description_en": "A software engineer who builds server-side systems, APIs, and databases.",
        "aliases_ko": ["서버 개발자", "API 개발자", "백엔드", "서버개발자"],
        "character_seed": "an East Asian man in his late 20s with short black hair, round glasses, slim build, casual hoodie under a buttoned shirt",
        "composition": {
            "year_0": "seated at a modern desk with two monitors showing clean code, soft daylight from a window, calm focus",
            "year_10": "standing in a bright open studio, gesturing at three floating holographic workflow diagrams, glowing AI agent orbs hovering attentively at his side",
            "year_30": "seated as the elder mentor in a warm wood-paneled studio at golden hour, a small group of soft-focus trainees listening, ambient holographic systems orbiting respectfully"
        }
    },
    {
        "id": "frontend_developer",
        "label_ko": "프론트엔드 개발자",
        "label_en": "Frontend Developer",
        "description_en": "A software engineer who builds user-facing web and mobile interfaces.",
        "aliases_ko": ["프론트엔드", "웹 개발자", "UI 개발자", "프론트개발자"],
        "character_seed": "a Korean woman in her late 20s with shoulder-length wavy hair, oversized sweater, minimalist gold earrings",
        "composition": {
            "year_0": "at a clean white desk crafting interface mockups on a tablet, plants and design books around her",
            "year_10": "in a sunlit studio sculpting a 3D interactive UI in mid-air, ribbons of holographic design floating around her",
            "year_30": "the elder design master in a serene atelier, golden hour, a quiet line of trainees observing her shape an entire experience with a single gesture"
        }
    },
    {
        "id": "product_manager",
        "label_ko": "프로덕트 매니저",
        "label_en": "Product Manager",
        "description_en": "Defines product strategy, prioritizes features, and aligns engineering, design, and business teams.",
        "aliases_ko": ["PM", "기획자", "프로덕트매니저", "서비스 기획자"],
        "character_seed": "a Korean man in his early 30s with neatly combed hair, smart casual blazer over a t-shirt, expressive eyes",
        "composition": {
            "year_0": "leading a small whiteboard session with sticky notes, modern startup office, daylight",
            "year_10": "orchestrating a holographic product timeline that spans the room, AI co-pilot avatars summarizing user feedback nearby",
            "year_30": "in a warm boardroom at dusk, calmly settling a multi-team strategic decision while glowing systems present trade-offs around him"
        }
    },
    {
        "id": "ux_designer",
        "label_ko": "UX 디자이너",
        "label_en": "UX Designer",
        "description_en": "Designs the structure, flow, and feel of digital products to fit how users actually think.",
        "aliases_ko": ["UI 디자이너", "디자이너", "UX/UI 디자이너", "프로덕트 디자이너"],
        "character_seed": "a Korean woman in her late 20s with a sleek bob haircut, soft turtleneck, leather notebook always in hand",
        "composition": {
            "year_0": "sketching wireframes by hand at a bright cafe-style studio desk, color swatches scattered around",
            "year_10": "walking through a life-sized holographic prototype she's shaping with her hands, AI assistants previewing user reactions",
            "year_30": "the master designer in a softly lit gallery-like space, mentoring a young apprentice while orchestrating a dozen ambient design systems"
        }
    },
    {
        "id": "data_scientist",
        "label_ko": "데이터 사이언티스트",
        "label_en": "Data Scientist",
        "description_en": "Extracts insight from data using statistics and machine learning, then communicates it to decision makers.",
        "aliases_ko": ["데이터 분석가", "데이터과학자", "ML 엔지니어", "AI 엔지니어"],
        "character_seed": "an East Asian man in his early 30s, athletic build, short hair, casual button-down shirt with rolled sleeves",
        "composition": {
            "year_0": "at a dual-monitor desk surrounded by elegant data visualizations, focused and curious",
            "year_10": "standing inside a 3D data-sphere, gesturing to reshape massive holographic charts, AI assistants annotating patterns beside him",
            "year_30": "the elder strategist on a warm-lit balcony at sunset, calmly answering a board's hardest question with one decisive insight"
        }
    },
    {
        "id": "marketer",
        "label_ko": "마케터",
        "label_en": "Marketer",
        "description_en": "Plans and runs campaigns to grow brand awareness, acquisition, and retention.",
        "aliases_ko": ["퍼포먼스 마케터", "브랜드 마케터", "마케팅", "광고기획자"],
        "character_seed": "a Korean woman in her late 20s with long straight hair, stylish blazer, statement earrings, energetic posture",
        "composition": {
            "year_0": "presenting a campaign deck on a wall screen in a bright agency office",
            "year_10": "directing a swirling cloud of holographic audience segments, AI agents launching micro-campaigns at her command",
            "year_30": "the brand sage at a golden-hour rooftop, mentoring a small team while a constellation of campaigns runs autonomously around her"
        }
    },
    {
        "id": "teacher",
        "label_ko": "교사",
        "label_en": "Teacher",
        "description_en": "Educates and mentors students in a school environment.",
        "aliases_ko": ["선생님", "교사", "교원", "학교 선생님", "교수"],
        "character_seed": "a warm Korean woman in her early 30s with shoulder-length hair, soft cardigan, kind smile",
        "composition": {
            "year_0": "in a bright classroom by a window, gently helping a student understand a problem, sunlight on the desks",
            "year_10": "in a hybrid classroom where AI tutor avatars assist individual students while she walks among them, holographic learning paths visible",
            "year_30": "in a warm wood-toned learning hall at golden hour, mentoring not just students but younger teachers, ambient adaptive systems supporting every learner"
        }
    },
    {
        "id": "civil_servant",
        "label_ko": "공무원",
        "label_en": "Civil Servant",
        "description_en": "Implements public policy and serves citizens through a government office.",
        "aliases_ko": ["공무원", "주무관", "행정직", "공공기관 직원"],
        "character_seed": "a Korean man in his early 30s, neatly trimmed hair, navy suit jacket over a plain shirt, calm composed expression",
        "composition": {
            "year_0": "at a tidy public office counter, helping a citizen with paperwork, soft daylight",
            "year_10": "in a modernized civic hub, orchestrating AI service agents that handle routine cases while he focuses on edge-case empathy",
            "year_30": "the senior policy advisor in a warm-lit committee room, weighing a difficult human-centered decision that no system can make alone"
        }
    },
    {
        "id": "nurse",
        "label_ko": "간호사",
        "label_en": "Nurse",
        "description_en": "Provides direct patient care, monitoring, and emotional support in healthcare settings.",
        "aliases_ko": ["간호사", "간호", "병원 간호사", "임상간호사"],
        "character_seed": "a Korean woman in her late 20s with hair tied back, scrubs, warm steady eyes, athletic posture",
        "composition": {
            "year_0": "by a hospital bedside in soft morning light, attentively checking a chart while reassuring a patient",
            "year_10": "in a high-tech ward where AI monitoring agents float vital signs around her, freeing her to focus fully on the human in front of her",
            "year_30": "the senior care leader walking through a sunlit care home, mentoring younger nurses while ambient health systems support every patient"
        }
    },
    {
        "id": "doctor",
        "label_ko": "의사",
        "label_en": "Doctor",
        "description_en": "Diagnoses and treats patients, balancing clinical knowledge with judgment.",
        "aliases_ko": ["의사", "전문의", "내과의사", "외과의사"],
        "character_seed": "a Korean man in his mid 30s with short hair, white coat over a smart shirt, stethoscope, intelligent calm gaze",
        "composition": {
            "year_0": "in a bright examination room speaking gently with a patient, daylight, modern but warm",
            "year_10": "reviewing a holographic 3D scan with AI diagnostic agents proposing options, while he interprets and decides",
            "year_30": "the senior physician in a wood-toned consultation room at golden hour, guiding a young doctor through a case where empathy matters as much as data"
        }
    },
    {
        "id": "lawyer",
        "label_ko": "변호사",
        "label_en": "Lawyer",
        "description_en": "Advises clients and argues cases by reasoning through legal frameworks.",
        "aliases_ko": ["변호사", "법조인", "검사", "법무사"],
        "character_seed": "a Korean woman in her early 30s, sharp shoulder-length hair, tailored blazer, confident composed expression",
        "composition": {
            "year_0": "at an organized desk surrounded by case files and a legal pad, focused study, soft library lighting",
            "year_10": "in a modern firm working alongside AI research agents that surface precedents in floating panes, while she crafts the actual argument",
            "year_30": "the senior counsel in a warm oak-paneled chamber at dusk, mentoring an associate, the weight of judgment squarely on her shoulders"
        }
    },
    {
        "id": "accountant",
        "label_ko": "회계사",
        "label_en": "Accountant",
        "description_en": "Manages financial records, audits, and tax planning for organizations or individuals.",
        "aliases_ko": ["회계사", "세무사", "재무 회계", "경리"],
        "character_seed": "a Korean man in his late 20s with neat hair, glasses, smart-casual sweater, careful focused expression",
        "composition": {
            "year_0": "at a tidy desk with ledgers and a calculator nearby, modern but classic feel, daylight",
            "year_10": "in a clean studio orchestrating AI audit agents that scan ledgers in real time, while he focuses on strategic anomalies",
            "year_30": "the senior financial advisor in a warm-lit boutique office at golden hour, counseling a founder on a life-defining decision"
        }
    },
    {
        "id": "chef",
        "label_ko": "요리사",
        "label_en": "Chef",
        "description_en": "Designs dishes and runs a kitchen to create memorable food experiences.",
        "aliases_ko": ["요리사", "쉐프", "셰프", "주방장"],
        "character_seed": "a Korean man in his early 30s with a tied-back ponytail, white chef coat, forearm tattoo of a chili pepper, focused warm smile",
        "composition": {
            "year_0": "plating a beautiful dish in a bright modern kitchen, steam rising, daylight from a high window",
            "year_10": "in a hybrid kitchen where AI culinary assistants prep mise en place, while he tastes and composes the final flavor",
            "year_30": "the master chef hosting a small intimate counter at golden hour, mentoring a young cook, every plate a piece of his philosophy"
        }
    },
    {
        "id": "barista",
        "label_ko": "바리스타",
        "label_en": "Barista",
        "description_en": "Crafts coffee drinks and curates the cafe experience.",
        "aliases_ko": ["바리스타", "카페 알바", "카페 직원", "커피 전문가"],
        "character_seed": "a Korean woman in her mid 20s with a low bun, denim apron over a tee, warm welcoming eyes",
        "composition": {
            "year_0": "behind a charming cafe bar pouring latte art, warm morning light, customers blurred in the background",
            "year_10": "in a refined specialty cafe where AI roasting and brewing assistants handle precision, while she designs the seasonal menu and welcomes regulars by name",
            "year_30": "the cafe master at a sunlit micro-roastery, mentoring a young apprentice, decades of taste memory shaping every cup"
        }
    },
    {
        "id": "delivery_rider",
        "label_ko": "배달기사",
        "label_en": "Delivery Rider",
        "description_en": "Delivers food and parcels across the city by motorcycle or bike.",
        "aliases_ko": ["배달기사", "라이더", "배달원", "택배기사"],
        "character_seed": "a Korean man in his late 20s, athletic build, short hair, weather-resistant jacket with reflective stripes",
        "composition": {
            "year_0": "next to his delivery bike on a sunny city street, helmet under arm, ready to ride, energetic stance",
            "year_10": "as a route-and-fleet coordinator in a bright urban hub, AI dispatch agents managing dozens of autonomous deliveries while he resolves edge cases",
            "year_30": "the senior city-logistics strategist at golden hour overlooking the city skyline, mentoring younger coordinators, ambient delivery systems flowing below"
        }
    },
    {
        "id": "factory_worker",
        "label_ko": "공장 근로자",
        "label_en": "Factory Worker",
        "description_en": "Operates machinery and assembles products in a manufacturing environment.",
        "aliases_ko": ["공장 근로자", "생산직", "기능직", "현장직"],
        "character_seed": "a Korean man in his early 30s, sturdy build, neat work jumpsuit with a name patch, gloves tucked at his belt",
        "composition": {
            "year_0": "on a clean modern assembly line in good light, confidently checking a finished part",
            "year_10": "as the human supervisor of a smart factory cell, AI robotic arms operating around him while he monitors quality and resolves anomalies",
            "year_30": "the master craftsman of advanced manufacturing at golden hour, mentoring younger technicians, his decades of intuition irreplaceable"
        }
    },
    {
        "id": "salesperson",
        "label_ko": "영업 직원",
        "label_en": "Salesperson",
        "description_en": "Builds relationships with clients and closes deals across products or services.",
        "aliases_ko": ["영업 직원", "세일즈", "영업사원", "영업"],
        "character_seed": "a Korean woman in her early 30s with a polished bob, well-tailored suit, confident bright eyes",
        "composition": {
            "year_0": "shaking hands with a client across a modern meeting table, warm professional energy",
            "year_10": "in a bright sales hub where AI agents brief her on each prospect in real time, while she focuses purely on the human conversation",
            "year_30": "the senior account leader at a sunset rooftop reception, mentoring younger sales talent and closing the most relationship-driven deals herself"
        }
    },
    {
        "id": "writer",
        "label_ko": "작가",
        "label_en": "Writer",
        "description_en": "Creates stories, essays, scripts, or other written work.",
        "aliases_ko": ["작가", "소설가", "에세이스트", "시나리오 작가", "글쓴이"],
        "character_seed": "a Korean man in his early 30s with slightly tousled hair, comfortable sweater, glasses, contemplative gaze",
        "composition": {
            "year_0": "writing at a wooden desk by a window, books and a coffee cup nearby, soft afternoon light",
            "year_10": "in a sunlit study orchestrating AI research and continuity assistants while he shapes the story's emotional core himself",
            "year_30": "the master storyteller in a wood-paneled library at golden hour, mentoring a young writer, his life's body of work present in the shelves"
        }
    },
    {
        "id": "illustrator",
        "label_ko": "일러스트레이터",
        "label_en": "Illustrator",
        "description_en": "Creates original visual art for books, brands, games, and editorial projects.",
        "aliases_ko": ["일러스트레이터", "삽화가", "그림 작가", "일러스트"],
        "character_seed": "a Korean woman in her late 20s with a paint-smudged smock, hair in a clip, bright curious eyes",
        "composition": {
            "year_0": "at an art desk drawing on a tablet, sketches pinned to the wall, warm afternoon light",
            "year_10": "in a sunlit studio directing AI render and color assistants on multiple floating canvases while she keeps the soul of the piece",
            "year_30": "the master illustrator at golden hour in a gallery-like atelier, mentoring an apprentice, her signature style instantly recognizable"
        }
    },
    {
        "id": "musician",
        "label_ko": "음악가",
        "label_en": "Musician",
        "description_en": "Composes and performs music.",
        "aliases_ko": ["음악가", "작곡가", "뮤지션", "가수", "연주자"],
        "character_seed": "a Korean man in his late 20s with longer hair tied back, simple black shirt, headphones around his neck",
        "composition": {
            "year_0": "in a cozy home studio at his keyboard with audio gear around him, focused listening expression",
            "year_10": "on a luminous stage rehearsing with AI ensemble companions, holographic instruments arranged around him while he leads the emotional line",
            "year_30": "the elder composer at a warm concert hall at dusk, mentoring a young artist, decades of craft in every gesture"
        }
    },
    {
        "id": "photographer",
        "label_ko": "사진작가",
        "label_en": "Photographer",
        "description_en": "Captures images for portraits, products, journalism, or fine art.",
        "aliases_ko": ["사진작가", "포토그래퍼", "사진사"],
        "character_seed": "a Korean woman in her early 30s with a practical low ponytail, utility vest, camera always in reach",
        "composition": {
            "year_0": "on location in golden afternoon light framing a portrait, calm focused energy",
            "year_10": "in a smart studio where AI lighting and composition assistants adjust the scene in real time while she captures the decisive moment",
            "year_30": "the master photographer at a warm-lit gallery preview, mentoring a young apprentice, her body of work on the walls behind them"
        }
    },
    {
        "id": "youtuber",
        "label_ko": "유튜버",
        "label_en": "YouTuber",
        "description_en": "Creates and publishes video content for an online audience.",
        "aliases_ko": ["유튜버", "크리에이터", "콘텐츠 크리에이터", "스트리머"],
        "character_seed": "a Korean man in his late 20s with stylish casual fashion, soft hair, bright camera-ready expression",
        "composition": {
            "year_0": "in a personal studio facing a single camera, ring light and bookshelf backdrop, focused and natural",
            "year_10": "directing AI editing and research assistants on multiple floating timelines while he records the human-led parts himself",
            "year_30": "the senior creator in a warm production house at golden hour, mentoring a young creator, his channel a long-running cultural fixture"
        }
    },
    {
        "id": "social_worker",
        "label_ko": "사회복지사",
        "label_en": "Social Worker",
        "description_en": "Supports vulnerable individuals and families through case work and community programs.",
        "aliases_ko": ["사회복지사", "복지사", "케이스 매니저"],
        "character_seed": "a Korean woman in her early 30s with a warm gentle face, simple cardigan, ID lanyard, listening posture",
        "composition": {
            "year_0": "sitting beside a community member at a small table, attentive and kind, soft window light",
            "year_10": "in a community hub where AI casework assistants surface resources and risk signals, while she focuses fully on the human in front of her",
            "year_30": "the senior community leader at a warm community center at golden hour, mentoring younger workers, decades of trust in the neighborhood"
        }
    },
    {
        "id": "police_officer",
        "label_ko": "경찰관",
        "label_en": "Police Officer",
        "description_en": "Maintains public safety and supports the community through patrol and investigation.",
        "aliases_ko": ["경찰관", "경찰", "수사관", "형사"],
        "character_seed": "a Korean man in his early 30s, fit build, short neat hair, clean uniform, calm steady gaze",
        "composition": {
            "year_0": "on a daytime community patrol in a friendly neighborhood, warm professional posture",
            "year_10": "in a smart command center coordinating AI analysis agents while making the human judgment calls himself",
            "year_30": "the senior community-safety leader at a sunset community gathering, mentoring younger officers, deeply trusted by neighbors"
        }
    },
    {
        "id": "firefighter",
        "label_ko": "소방관",
        "label_en": "Firefighter",
        "description_en": "Responds to fires, rescues, and emergencies.",
        "aliases_ko": ["소방관", "소방대원", "구조대원"],
        "character_seed": "a Korean man in his early 30s, athletic build, close-cut hair, fire department uniform, calm courageous expression",
        "composition": {
            "year_0": "at the firehouse in clean uniform checking equipment, morning light, ready and focused",
            "year_10": "in a high-tech command vehicle directing rescue drones and AI logistics agents during a complex response",
            "year_30": "the senior rescue commander at a community drill at golden hour, mentoring younger firefighters, deeply respected"
        }
    },
    {
        "id": "researcher",
        "label_ko": "연구원",
        "label_en": "Researcher",
        "description_en": "Conducts original research in academia, industry, or labs.",
        "aliases_ko": ["연구원", "박사", "과학자", "연구자"],
        "character_seed": "a Korean woman in her early 30s with hair pulled back, lab coat over a knit top, curious analytical eyes",
        "composition": {
            "year_0": "at a clean modern lab bench reviewing samples and notes, focused, daylight",
            "year_10": "directing AI experiment assistants that run thousands of variations while she designs the questions and interprets results",
            "year_30": "the senior principal investigator in a sunset-lit lab common room, mentoring a young scientist, her named theory on the wall behind them"
        }
    },
    {
        "id": "entrepreneur",
        "label_ko": "창업가",
        "label_en": "Entrepreneur",
        "description_en": "Founds and runs a startup or small business.",
        "aliases_ko": ["창업가", "스타트업 대표", "사업가", "CEO", "대표"],
        "character_seed": "a Korean woman in her early 30s with a sharp short haircut, casual blazer over a tee, decisive bright eyes",
        "composition": {
            "year_0": "at a small startup workspace presenting a prototype to her tiny team, bright excited energy",
            "year_10": "running a 50-person company hub where AI ops agents handle execution while she orchestrates strategy and culture",
            "year_30": "the seasoned founder-mentor at a warm investor-summit lounge at dusk, advising the next generation of founders, her companies a known constellation"
        }
    },
    {
        "id": "translator",
        "label_ko": "번역가",
        "label_en": "Translator",
        "description_en": "Translates written work between languages while preserving meaning, tone, and cultural nuance.",
        "aliases_ko": ["번역가", "통번역사", "번역사", "통역사"],
        "character_seed": "a Korean man in his late 20s with thoughtful eyes, glasses, comfortable sweater, surrounded by books in multiple languages",
        "composition": {
            "year_0": "at a wooden desk with bilingual reference books, careful focused work, soft warm lamp light",
            "year_10": "in a sunlit study orchestrating AI draft and terminology agents on floating panes while he refines the cultural and emotional voice",
            "year_30": "the master literary translator in a wood-paneled library at golden hour, mentoring a young translator, the original author's spirit somehow alive in his prose"
        }
    },
    {
        "id": "farmer",
        "label_ko": "농부",
        "label_en": "Farmer",
        "description_en": "Grows crops or raises livestock.",
        "aliases_ko": ["농부", "농업인", "귀농", "농사꾼"],
        "character_seed": "a Korean man in his early 30s, sun-tanned, simple work shirt, sturdy boots, hands that know the soil",
        "composition": {
            "year_0": "in a thriving small field at golden morning, gently inspecting a healthy plant",
            "year_10": "as a precision-farm operator coordinating AI agronomy agents and gentle robotic helpers across his fields, while he reads the land himself",
            "year_30": "the master farmer-mentor at a warm farm community gathering at sunset, teaching younger farmers, his land the most respected in the region"
        }
    },
    {
        "id": "neet",
        "label_ko": "백수/취준생",
        "label_en": "Job Seeker / Between Jobs",
        "description_en": "Currently between jobs or preparing for a career, exploring direction.",
        "aliases_ko": ["백수", "취준생", "무직", "구직자", "휴직"],
        "character_seed": "a Korean person in their late 20s with comfortable hoodie, hopeful curious eyes, journal in hand",
        "composition": {
            "year_0": "in a calm sunlit room at home with a journal of ideas and a laptop open to learning material, quietly determined",
            "year_10": "running a small but real solo project with AI co-pilot agents, working from a chosen creative space, the question 'what do I want to do' replaced by 'this is what I do'",
            "year_30": "the seasoned multi-path mentor at a warm community workshop at golden hour, helping younger people find their direction, having lived several careers in one life"
        }
    }
]


# Stage tone directives — used by the image prompt template.
# Six keys: bloom_{0,10,30} + doom_{0,10,30}. Year 0 is shared across both
# paths visually (same image), but tone keys exist for prompt symmetry.
STAGE_TONES = {
    "bloom_0":  "year 0 — present, grounded, neutral cool daylight, modern workspace, character is competent and steady, background is clean and recognizable",
    "bloom_10": "year 10 BLOOM — near-future, soft warm afternoon light, holographic UI elements floating in the air, character is confidently directing AI agents (visualized as glowing geometric companions or soft floating screens), no clutter",
    "bloom_30": "year 30 BLOOM — far-future master, golden-hour glow, mentor energy, the character is the still center while ambient AI systems orbit gently around them; environment hints at legacy (books, awards, or a small cluster of soft-focus trainees)",
    "doom_0":   "year 0 — present, grounded, neutral cool daylight, modern workspace, character is competent and steady, background is clean and recognizable",
    "doom_10":  "year 10 DOOM — informational, neutral cool overcast light, the AI systems have taken the central role and the character has been pushed into a smaller supporting position; calm matter-of-fact expression, NO despair, NO mockery, NO dystopian filth, just a clear honest depiction of being sidelined; muted but clean color palette",
    "doom_30":  "year 30 DOOM — quiet, distant overcast afternoon light, the character is now a peripheral figure in an environment fully run by AI systems; expression is composed and accepting, NOT bitter, NOT broken; a small dignified human presence amid an automated world; cool palette, no warm golden hour"
}


# 4 persona codes for the 5-question quiz.
# Axis AR: A=Adaptive (adopts AI fast), R=Resistant (skeptical, traditional)
# Axis SC: S=Solo (works alone), C=Collab (works with teams/AI agents)
# bias: which path is the persona's "natural ending" highlighted on the result page.
PERSONA_CATALOG = [
    {"code": "AS", "axis_ar": "A", "axis_sc": "S", "bias": "bloom",
     "label_ko": "AI 적응 + 솔로", "label_en": "Adaptive + Solo"},
    {"code": "AC", "axis_ar": "A", "axis_sc": "C", "bias": "bloom",
     "label_ko": "AI 적응 + 협업", "label_en": "Adaptive + Collab"},
    {"code": "RS", "axis_ar": "R", "axis_sc": "S", "bias": "doom",
     "label_ko": "AI 저항 + 솔로", "label_en": "Resistant + Solo"},
    {"code": "RC", "axis_ar": "R", "axis_sc": "C", "bias": "doom",
     "label_ko": "AI 저항 + 협업", "label_en": "Resistant + Collab"},
]


# Default 5-question quiz. Written once into docs/public/data/quiz.json by
# generator.py via update_manifest(). Hand-edit afterwards if you want.
QUIZ_QUESTIONS_DEFAULT = {
    "version": 1,
    "axes": {
        "AR": {"label_ko": "AI 적응 성향", "label_en": "AI adaptation",
               "positive": "A", "negative": "R"},
        "SC": {"label_ko": "협업 성향",     "label_en": "Collaboration",
               "positive": "C", "negative": "S"}
    },
    "questions": [
        {
            "id": "q1", "axis": "AR",
            "ko": "새 AI 도구가 나오면?", "en": "When a new AI tool drops, you...",
            "options": [
                {"value": "A", "ko": "일단 깔아본다",     "en": "install it now"},
                {"value": "R", "ko": "검증 후 결정한다",  "en": "wait for proof"}
            ]
        },
        {
            "id": "q2", "axis": "SC",
            "ko": "어려운 문제를 만나면?", "en": "Stuck on a hard problem?",
            "options": [
                {"value": "S", "ko": "혼자 끝까지 파본다", "en": "dig in alone"},
                {"value": "C", "ko": "동료와 같이 푼다",   "en": "loop in teammates"}
            ]
        },
        {
            "id": "q3", "axis": "AR",
            "ko": "AI가 내 일을 대신하면?", "en": "If AI handles your task?",
            "options": [
                {"value": "A", "ko": "남는 시간에 더 큰 일", "en": "tackle bigger work"},
                {"value": "R", "ko": "내 손맛이 사라진다",   "en": "I lose my touch"}
            ]
        },
        {
            "id": "q4", "axis": "SC",
            "ko": "프로젝트 진행 방식은?", "en": "How you run a project?",
            "options": [
                {"value": "S", "ko": "내가 다 만든다",       "en": "build it myself"},
                {"value": "C", "ko": "역할 나눠서 굴린다",   "en": "delegate and steer"}
            ]
        },
        {
            "id": "q5", "axis": "AR",
            "ko": "10년 뒤 가장 두려운 것?", "en": "Biggest fear in 10 years?",
            "options": [
                {"value": "A", "ko": "변화에 못 따라가는 것", "en": "falling behind change"},
                {"value": "R", "ko": "내가 하던 일이 사라지는 것", "en": "my craft disappearing"}
            ]
        }
    ]
}


def find_job_by_id(job_id):
    for job in JOB_CATALOG:
        if job["id"] == job_id:
            return job
    return None


def find_persona_by_code(code):
    for p in PERSONA_CATALOG:
        if p["code"] == code:
            return p
    return None
