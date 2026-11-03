<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0E9F8E,50:136F63,100:1C3C3C&height=220&section=header&text=Jayakrishnan%20B&fontSize=52&fontColor=FFFFFF&animation=fadeIn&fontAlignY=36&desc=LLM%20agents%20%E2%80%A2%20AI%20quality%20engineering%20%E2%80%A2%20computer%20vision&descSize=18&descAlignY=58" width="100%" alt="Jayakrishnan B" />

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2800&pause=900&color=0E9F8E&center=true&vCenter=true&width=640&lines=%3E+building+agents+that+call+tools+and+cite+sources;%3E+then+trying+very+hard+to+break+them;%3E+evals+%E2%80%A2+red-teaming+%E2%80%A2+regression+gates+in+CI;%3E+YOLOv8+models+that+see+wrinkles+and+vertebrae;%3E+if+it+isn't+measured%2C+it+isn't+done" alt="Typing SVG" />

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-krishinfowork-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krishinfowork/)
[![Portfolio](https://img.shields.io/badge/Portfolio-visit-0E9F8E?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-jk-two.vercel.app)
[![Email](https://img.shields.io/badge/Email-say_hello-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jayakrishxn@gmail.com)
<br/>
[![Followers](https://img.shields.io/github/followers/Jrkrish?style=flat-square&label=followers&color=0E9F8E&labelColor=1C3C3C)](https://github.com/Jrkrish)
<img src="https://komarev.com/ghpvc/?username=Jrkrish&style=flat-square&color=0E9F8E&label=profile+views" alt="Profile views" />

</div>

---

## `$ whoami`

```python
class Jayakrishnan:
    education = "B.Tech Information Technology · Sri Manakula Vinayagar Engineering College, Puducherry"
    graduated = 2026
    cgpa      = 7.90
    based_in  = "Villupuram, Tamil Nadu 🇮🇳"

    focus     = ["AI agents & LLM apps", "AI testing & evaluation",
                 "computer vision", "full-stack web"]
    languages = ["Python", "TypeScript", "JavaScript", "SQL", "PHP"]
    open_to   = "new opportunities and collaborations"

    def fun_fact(self):
        return "I write tests for my tests."
```

---

## 🔁 How I ship an LLM feature

```mermaid
flowchart LR
    A(["💡 Idea"]) --> B["🤖 Agent<br/>tools · hybrid RAG · memory"]
    B --> C["🛡️ Guardrails<br/>injection · PII · leaks"]
    C --> D["🧪 Eval suite<br/>golden set × N runs"]
    D --> E["⚖️ Judge<br/>different model family"]
    E --> F["🔴 Red team<br/>attack success per category"]
    F --> G{"🚦 Regression gate<br/>prompts × models vs baseline"}
    G -- "drops below baseline" --> B
    G -- "holds" --> H(["🚀 Merge"])
    H --> I["📉 Drift monitor<br/>nightly"]
    I -. "prod failure → new test case" .-> D

    classDef build fill:#0E9F8E,stroke:#0B7A6E,color:#fff
    classDef check fill:#1C3C3C,stroke:#0E9F8E,color:#fff
    classDef gate fill:#F5A623,stroke:#B57700,color:#1C1C1C
    class A,B,H build
    class C,D,E,F,I check
    class G gate
```

---

## 🧰 Tech arsenal

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,ts,js,php,html,css&theme=dark" alt="Languages" /><br/>
  <img src="https://skillicons.dev/icons?i=fastapi,flask,nextjs,tailwind,redis,sqlite&theme=dark" alt="Backend and web" /><br/>
  <img src="https://skillicons.dev/icons?i=pytorch,opencv,docker,aws,githubactions,vercel,postman,git&theme=dark" alt="ML and infra" />
</p>

<div align="center">

**Agents & LLMs** &nbsp;
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square)
![RAG](https://img.shields.io/badge/Hybrid_RAG-1C3C3C?style=flat-square)
![Tool calling](https://img.shields.io/badge/Tool_Calling-1C3C3C?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square)

**AI quality & testing** &nbsp;
![DeepEval](https://img.shields.io/badge/DeepEval-0E9F8E?style=flat-square)
![promptfoo](https://img.shields.io/badge/promptfoo-0E9F8E?style=flat-square)
![pytest](https://img.shields.io/badge/pytest-0A9EDC?style=flat-square&logo=pytest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Locust](https://img.shields.io/badge/Locust-0E9F8E?style=flat-square)
![Appium](https://img.shields.io/badge/Appium-662D91?style=flat-square&logo=appium&logoColor=white)

**Vision** &nbsp;
![YOLOv8](https://img.shields.io/badge/YOLOv8-111111?style=flat-square)
![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-111111?style=flat-square&logo=onnx&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white)

</div>

---

## 🚀 Things I've built

> Click a project to look under the hood.

<details>
<summary><b>🧪 FanCare LLM Quality</b> · a support agent, and the platform that tries to break it</summary>
<br/>

**Repo:** [Jrkrish/fancare-llm-quality](https://github.com/Jrkrish/fancare-llm-quality)

- **Agent:** tool-calling loop over 5 tools (orders, warranty, recommendations, tickets, doc search) with injected timeouts, malformed and empty responses
- **Retrieval:** BM25 + vector search + cross-encoder reranking over 19 product docs; every claim cites `[DOC-xx:n]`, and with no evidence it refuses
- **Uploads:** pulls serial number, model and purchase date out of PDFs and photos with OCR, including noisy scans
- **Guardrails:** a separate layer for prompt injection, PII redaction, system-prompt leaks and poisoned retrieved passages
- **Evals:** 66-case golden set × N runs with variance, a judge from a different model family, hand-labelled judge calibration
- **Red team:** 42 attack cases plus promptfoo, attack success rate per category
- **CI:** regression gate across 3 prompt versions × 2 models blocks merges; nightly drift job
- **Tests:** API (OpenAPI-validated), Playwright UI, Locust load, SQL data checks, Appium skeleton, flaky-test quarantine

`FastAPI` `DeepEval` `promptfoo` `fastembed` `SQLite` `Docker` `GitHub Actions`
</details>

<details>
<summary><b>🛫 DevPilot</b> · from one requirement to a delivered project</summary>
<br/>

**Repo:** [Jrkrish/Devpilot-SDLC](https://github.com/Jrkrish/Devpilot-SDLC)

- State-driven LangGraph workflow with conditional routing across the whole SDLC
- Generates requirements, user stories, functional and technical design docs, code, security recommendations and test cases
- Redis-backed state

`LangGraph` `Redis` `Python`
</details>

<details>
<summary><b>🤖 SDLC Agents</b> · a team of AI agents running the dev lifecycle</summary>
<br/>

**Repo:** [Jrkrish/SDLC-Agents](https://github.com/Jrkrish/SDLC-Agents)

- AI agents automate the software development lifecycle end to end, driven from a Streamlit UI

`Python` `Streamlit`
</details>

<details>
<summary><b>📄 AI Resume Generator</b> · ATS-friendly resumes in minutes</summary>
<br/>

**Repo:** [Jrkrish/Resume](https://github.com/Jrkrish/Resume)

- Gemini writes the content, PDFKit renders the PDF, Razorpay handles tiered payments

`Flask` `Gemini API` `Razorpay` `Tailwind`
</details>

<details>
<summary><b>👁️ Wrinkle Detection</b> · YOLOv8 segmentation on faces</summary>
<br/>

**Repo:** [Jrkrish/Wrinkle-Detection](https://github.com/Jrkrish/Wrinkle-Detection)

- YOLOv8s segmentation fine-tuned on 3 classes: forehead, frown, wrinkle
- Upload a photo and get masks back in a Streamlit app

`YOLOv8` `OpenCV` `Streamlit`
</details>

<details>
<summary><b>🦴 Spine Segmentation</b> · finding vertebrae automatically</summary>
<br/>

**Repo:** [Jrkrish/Yolo-Spine](https://github.com/Jrkrish/Yolo-Spine)

- Detects the L1–L5 vertebrae and the S1 sacrum to cut manual annotation work in medical imaging

`YOLOv8` `Python`
</details>

<details>
<summary><b>🩺 Skin Cancer Prediction</b> · lesion classification on the web</summary>
<br/>

**Repo:** [Jrkrish/Skin-Cancer-Prediction](https://github.com/Jrkrish/Skin-Cancer-Prediction)

- Flask app that classifies an uploaded skin-lesion image

`Flask` `Python`
</details>

<details>
<summary><b>🎨 Studio Infinity</b> · a studio site with motion</summary>
<br/>

**Repo:** [Jrkrish/Company-Portfolio](https://github.com/Jrkrish/Company-Portfolio) · **Live:** [company-portfolio-sage.vercel.app](https://company-portfolio-sage.vercel.app/)

- Custom cursor, smooth animations, filterable portfolio, contact form with validation

`Next.js 15` `TypeScript` `Tailwind`
</details>

---

## 🧪 Unit-testing myself

```console
$ pytest tests/test_jayakrishnan.py -v
test_builds_things_that_work ............. PASSED
test_picks_up_new_stacks_fast ............ PASSED
test_reads_the_docs_first ................ PASSED
test_coffee_level ........................ PASSED  (critical)
test_ships_without_tests ................. XFAIL   (never happens)
test_gives_up_on_a_bug ................... XFAIL   (not in this lifetime)

================= 4 passed, 2 xfailed in 0.42s =================
```

---

## 📊 GitHub analytics

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Jrkrish&theme=github_dark" />
  <img width="100%" src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Jrkrish&theme=github" alt="Profile details and contribution graph" />
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=Jrkrish&theme=github_dark" />
  <img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=Jrkrish&theme=github" alt="GitHub stats" />
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://streak-stats.demolab.com/?user=Jrkrish&theme=github-dark-blue&hide_border=true&ring=0E9F8E&fire=0E9F8E&currStreakLabel=0E9F8E" />
  <img width="49%" src="https://streak-stats.demolab.com/?user=Jrkrish&hide_border=true&ring=0E9F8E&fire=0E9F8E&currStreakLabel=0E9F8E" alt="GitHub streak" />
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=Jrkrish&theme=github_dark" />
  <img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=Jrkrish&theme=github" alt="Top languages by repo" />
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=Jrkrish&theme=github_dark" />
  <img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=Jrkrish&theme=github" alt="Top languages by commit" />
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Jrkrish/Jrkrish/output/github-snake-dark.svg" />
  <img width="100%" src="https://raw.githubusercontent.com/Jrkrish/Jrkrish/output/github-snake.svg" alt="Snake eating my contribution graph" />
</picture>

</div>

---

<div align="center">

**Building something with LLMs and want it to actually be reliable? Let's talk.**

[![LinkedIn](https://img.shields.io/badge/Let's_connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krishinfowork/)
[![Email](https://img.shields.io/badge/Say_hello-0E9F8E?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jayakrishxn@gmail.com)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1C3C3C,50:136F63,100:0E9F8E&height=120&section=footer" width="100%" alt="" />
