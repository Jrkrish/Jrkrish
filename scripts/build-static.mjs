// Builds the static newspaper pages into assets/: the profile, the markets
// page, the project stories, the classified flyer with its tear-off tabs, and
// the footer. Re-run after editing this file or assets/src/, and commit the
// output:
//
//   node scripts/build-static.mjs
//
// The front page and the numbers page change daily; build-daily.mjs makes them.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INK, arrow, esc, folio, fontData, root, svgDoc, textBlock, wrap } from "./lib.mjs";

const SOURCE = "scripts/build-static.mjs";

function save(name, svg) {
  writeFileSync(join(root, "assets", name), svg);
  console.log(`assets/${name} (${svg.length} bytes)`);
}

// ---------------------------------------------------------------- profile

function profilePage() {
  const w = 1200, h = 490;
  const quote = wrap("I write tests for my tests.", "PF400I", 30, 215);
  const quoteTop = 196, quoteEnd = quoteTop + quote.length * 40;

  const body =
    "Jayakrishnan B studied Information Technology at Sri Manakula Vinayagar Engineering College in Puducherry and graduated with the class of 2026, carrying a CGPA of 7.90. The work splits three ways: AI and LLM apps, computer vision, and full-stack web, with a standing habit of testing things until they break. Python, TypeScript, JavaScript, SQL and PHP are the daily languages. The status line, as of this edition, reads: open to new opportunities and collaborations.";
  const size = 17, lh = 25, colW = 232, gap = 26, x1 = 300, x2 = x1 + colW + gap, top = 196;
  const capW = 50, capLines = 4;
  const lines = wrap(body.slice(1), "LORA400", size, (i) => (i < capLines ? colW - capW : colW));
  const perCol = Math.ceil(lines.length / 2);
  const col1 = lines.slice(0, perCol), col2 = lines.slice(perCol);
  const col1Text = col1
    .map((l, i) => `<tspan x="${i < capLines ? x1 + capW : x1}" y="${top + i * lh}">${esc(l)}</tspan>`)
    .join("");

  const facts = [
    ["STUDIED", "B.Tech Information Technology"],
    ["COLLEGE", "SMVEC, Puducherry"],
    ["CLASS OF", "2026 · CGPA 7.90"],
    ["BASED IN", "Tamil Nadu, India"],
    ["SPEAKS", "Python · TypeScript · JS · SQL · PHP"],
    ["OPEN TO", "New roles and collaborations"],
  ];
  const fx = 840, fy = 160, fw = 320, rowH = 44;
  const factRows = facts
    .map(
      ([k, v], i) => `
    <text class="mono red" x="${fx + 16}" y="${fy + 56 + i * rowH}" font-size="11" letter-spacing="1.8">${k}</text>
    <text class="body ink" x="${fx + 16}" y="${fy + 75 + i * rowH}" font-size="16">${esc(v)}</text>
    ${i < facts.length - 1 ? `<rect class="ink" x="${fx + 16}" y="${fy + 84 + i * rowH}" width="${fw - 32}" height="1" opacity=".25"/>` : ""}`,
    )
    .join("");

  return svgDoc({
    w, h, source: SOURCE,
    title: "Profile: meet the engineer who tests the tests",
    desc: `${body} Pull quote: “I write tests for my tests.”`,
    fonts: ["PF900", "PF400I", "PM500", "LORA400"],
    body: `${folio(w, "PROFILE", "PAGE B1")}

  <!-- pull quote -->
  <rect class="ink" x="40" y="78" width="227" height="2.5"/>
  <text class="serif red rise" x="32" y="186" font-size="150" font-weight="900" style="animation-delay:.3s">“</text>
  <g class="rise" style="animation-delay:.5s">${textBlock(quote, { x: 40, y: quoteTop, lh: 40, cls: "serif ink", size: 30, extra: 'font-style="italic"' })}</g>
  <text class="mono red rise" x="40" y="${quoteEnd + 14}" font-size="11.5" letter-spacing="2" style="animation-delay:.6s">— JAYAKRISHNAN, ON QUALITY</text>
  <rect class="ink" x="40" y="${quoteEnd + 40}" width="227" height="1"/>

  <!-- headline -->
  <text class="mono red rise" x="300" y="84" font-size="13" letter-spacing="2.2" style="animation-delay:.3s">MEET THE ENGINEER</text>
  <text class="serif ink rise" x="298" y="134" font-size="44" font-weight="900" style="animation-delay:.45s">Meet the engineer who tests the tests</text>
  <rect class="ink" x="300" y="152" width="510" height="1" opacity=".5"/>
  <text class="mono ink rise" x="300" y="176" font-size="11.5" letter-spacing="2" style="animation-delay:.6s">TAMIL NADU, INDIA</text>

  <!-- story, with a drop cap -->
  <g class="rise" style="animation-delay:.75s">
    <text class="serif ink" x="${x1 - 2}" y="${top + 2 * lh + 4}" font-size="${lh * 3 + 8}" font-weight="900">${esc(body[0])}</text>
    <text class="body ink" font-size="${size}">${col1Text}</text>
    ${textBlock(col2, { x: x2, y: top, lh, cls: "body ink", size })}
  </g>
  <rect class="ink" x="${x2 - gap / 2}" y="${top - 16}" width="1" height="${perCol * lh}" opacity=".35"/>

  <!-- at a glance -->
  <g class="rise" style="animation-delay:.9s">
    <rect x="${fx}" y="${fy}" width="${fw}" height="${30 + facts.length * rowH + 16}" fill="none" stroke="${INK}" stroke-width="1.2"/>
    <rect x="${fx}" y="${fy}" width="${fw}" height="30" fill="${INK}"/>
    <text class="mono" x="${fx + 16}" y="${fy + 20}" font-size="12" letter-spacing="2.4" fill="#F2EADB">AT A GLANCE</text>${factRows}
  </g>`,
  });
}

// ---------------------------------------------------------------- markets

const SECTORS = [
  ["LANGUAGES", [["PY", "Python"], ["TS", "TypeScript"], ["JS", "JavaScript"], ["SQL", "SQL"], ["PHP", "PHP"]]],
  ["WEB & BACKEND", [["FAPI", "FastAPI"], ["FLSK", "Flask"], ["NEXT", "Next.js"], ["RCT", "React"], ["TW", "Tailwind"], ["PG", "PostgreSQL"], ["RDS", "Redis"]]],
  ["AI & AGENTS", [["LGR", "LangGraph"], ["RAG", "Hybrid RAG"], ["GEM", "Gemini"], ["GROQ", "Groq"], ["EVAL", "DeepEval"]]],
  ["VISION & ML", [["YOLO", "YOLOv8"], ["TRCH", "PyTorch"], ["OCV", "OpenCV"], ["ONNX", "ONNX Runtime"], ["STRM", "Streamlit"]]],
  ["QUALITY & OPS", [["PYT", "pytest"], ["PW", "Playwright"], ["DKR", "Docker"], ["AWS", "AWS"], ["GHA", "Actions"], ["VCL", "Vercel"]]],
];

function marketsPage() {
  const w = 1200, colW = 224, x0 = 40, top = 186, rowH = 27;
  const rows = Math.max(...SECTORS.map(([, t]) => t.length));
  const h = top + rows * rowH + 60;

  const cols = SECTORS.map(([name, tickers], c) => {
    const x = x0 + c * colW;
    const list = tickers
      .map(
        ([sym, label], i) => `
    <text class="mono ink" x="${x + 12}" y="${top + 30 + i * rowH}" font-size="13">${esc(sym)}</text>
    <text class="body ink" x="${x + 66}" y="${top + 30 + i * rowH}" font-size="16">${esc(label)}</text>
    <path class="up" d="M${x + colW - 26} ${top + 26 + i * rowH}l5 -8 5 8z" fill="${INK}" style="animation-delay:${(1 + c * 0.15 + i * 0.06).toFixed(2)}s"/>`,
      )
      .join("");
    return `
  <g class="rise" style="animation-delay:${(0.5 + c * 0.12).toFixed(2)}s">
    <text class="mono red" x="${x + 12}" y="${top}" font-size="12" letter-spacing="2">${esc(name)}</text>
    <rect class="ink" x="${x + 12}" y="${top + 9}" width="${colW - 24}" height="1.2"/>${list}
  </g>${c ? `\n  <rect class="ink" x="${x}" y="${top - 14}" width="1" height="${rows * rowH + 30}" opacity=".35"/>` : ""}`;
  }).join("");

  return svgDoc({
    w, h, source: SOURCE,
    title: "Markets: all stacks trading up",
    desc: SECTORS.map(([n, t]) => `${n}: ${t.map((x) => x[1]).join(", ")}.`).join(" "),
    fonts: ["PF900", "PF400I", "PM500", "LORA400"],
    css: `
      .up { animation: up .5s ease-out both; transform-box: fill-box; transform-origin: center; }
      @keyframes up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`,
    body: `${folio(w, "MARKETS", "PAGE C1")}
  <text class="mono red rise" x="40" y="84" font-size="13" letter-spacing="2.2" style="animation-delay:.2s">MARKET REPORT</text>
  <text class="serif ink rise" x="38" y="132" font-size="44" font-weight="900" style="animation-delay:.3s">All stacks trading up</text>
  <text class="serif ink rise" x="1160" y="132" font-size="18" font-style="italic" text-anchor="end" style="animation-delay:.4s">Our market desk on the tools in daily use. No sell signals.</text>
  <rect class="ink" x="40" y="152" width="1120" height="1" opacity=".5"/>${cols}
  <rect class="ink" x="40" y="${h - 36}" width="1120" height="1" opacity=".5"/>
  <text class="mono ink" x="40" y="${h - 14}" font-size="11" letter-spacing="2" opacity=".7">ALL PRICES QUOTED IN CUPS OF FILTER COFFEE</text>
  <text class="mono ink" x="1160" y="${h - 14}" font-size="11" letter-spacing="2" opacity=".7" text-anchor="end">MARKET CLOSED: NEVER</text>`,
  });
}

// ---------------------------------------------------------------- stories

const STORIES = [
  {
    file: "story-fancare.svg", layout: "lead", kicker: "LEAD STORY · LLM QUALITY", repo: "fancare-llm-quality",
    headline: "Support bot cites its sources, and its own test suite tries to break it",
    standfirst: "FanCare answers from product docs with citations, checks orders, warranty and tickets through tools, and reads uploaded warranty cards with OCR. Around it sits the real story: golden-set evals with variance, red-team attacks scored per category, and a CI gate that refuses to merge a worse prompt.",
    stack: "FastAPI · DeepEval · promptfoo · GitHub Actions",
  },
  {
    file: "story-devpilot.svg", layout: "half", kicker: "AGENTS", repo: "Devpilot-SDLC",
    headline: "One requirement in, a whole project out",
    standfirst: "A LangGraph state machine walks the lifecycle: user stories, design docs, code, security notes and test cases, with a human approval step between stages.",
    stack: "LangGraph · Redis · Python",
  },
  {
    file: "story-sdlc-agents.svg", layout: "half", kicker: "AGENTS", repo: "SDLC-Agents",
    headline: "A team of AI agents, each owning one step",
    standfirst: "Pick Gemini, Groq or OpenAI, describe the project, and the agents return stories, specs, code, tests and a production-readiness check.",
    stack: "Python · Streamlit · Gemini · Groq",
  },
  {
    file: "story-wrinkles.svg", layout: "half", kicker: "COMPUTER VISION", repo: "Wrinkle-Detection",
    headline: "Model learns to find wrinkles on a face",
    standfirst: "YOLOv8s segmentation fine-tuned on three classes: forehead, frown and wrinkle. Upload a photo and the masks are drawn straight onto it.",
    stack: "YOLOv8 · OpenCV · Streamlit",
  },
  {
    file: "story-spine.svg", layout: "half", kicker: "HEALTH · VISION", repo: "Yolo-Spine",
    headline: "Every vertebra, spotted automatically",
    standfirst: "YOLOv8 finds L1 to L5 and the S1 sacrum on a spine scan and boxes each one, built to cut manual labelling in medical imaging.",
    stack: "YOLOv8 · Python · Streamlit",
  },
  {
    file: "story-resume.svg", layout: "half", kicker: "BUSINESS", repo: "Resume",
    headline: "AI-written resumes that get past the robots",
    standfirst: "Gemini drafts ATS-friendly content from your details, PDFKit renders the PDF instantly, and Razorpay handles the pricing tiers.",
    stack: "Flask · Gemini API · Razorpay · Tailwind",
  },
  {
    file: "story-skin.svg", layout: "half", kicker: "HEALTH", repo: "Skin-Cancer-Prediction",
    headline: "A quick check on a photo of a skin lesion",
    standfirst: "Upload an image and a trained model classifies the lesion, served through a simple Flask web app.",
    stack: "Flask · Python · Jupyter",
  },
  {
    file: "story-studio.svg", layout: "slim", kicker: "ARTS & DESIGN", repo: "Company-Portfolio",
    headline: "Studio site goes minimal, with motion",
    standfirst: "Custom cursor, smooth page transitions, a filterable portfolio and a validated contact form. Live at company-portfolio-sage.vercel.app.",
    stack: "Next.js 15 · TypeScript · Tailwind",
  },
];

// "Read on GitHub" sits on the kicker line; the footer carries the stack.
function readMore(w, y, margin) {
  return `<text class="mono ink" x="${w - margin - 18}" y="${y}" font-size="12" letter-spacing="1.6" text-anchor="end">READ ON GITHUB</text>
  ${arrow(w - margin - 11, y - 10, 10)}`;
}

function storyFooter(w, h, stack, margin = 32) {
  return `
  <rect class="ink" x="${margin}" y="${h - 46}" width="${w - margin * 2}" height="1" opacity=".45"/>
  <text class="mono ink" x="${margin}" y="${h - 20}" font-size="12" letter-spacing="1.6"><tspan class="red">FILED UNDER</tspan>  ${esc(stack.toUpperCase())}</text>`;
}

function story(s, i) {
  const desc = `${s.kicker}. ${s.headline}. ${s.standfirst} Built with ${s.stack}. Click to open the repo.`;
  const common = { source: SOURCE, title: s.headline, desc, fonts: [s.layout === "lead" ? "PF900" : "PF700", "PM500", "LORA400"] };

  if (s.layout === "lead") {
    const w = 1200, h = 380;
    const head = wrap(s.headline, "PF900", 46, 1120);
    const colW = 540, sizeS = 19, lhS = 28;
    const lines = wrap(s.standfirst, "LORA400", sizeS, colW);
    const per = Math.ceil(lines.length / 2);
    const y0 = 140 + head.length * 54;
    return svgDoc({
      ...common, w, h,
      body: `${folio(w, "THE PORTFOLIO", "PAGE D1")}
  <text class="mono red rise" x="40" y="86" font-size="13" letter-spacing="2.2" style="animation-delay:.2s"><tspan class="blink">●</tspan> ${esc(s.kicker)}</text>
  <g class="rise" style="animation-delay:.35s">${textBlock(head, { x: 38, y: 136, lh: 54, cls: "serif ink", size: 46, extra: 'font-weight="900"' })}</g>
  <g class="rise" style="animation-delay:.5s">
    ${textBlock(lines.slice(0, per), { x: 40, y: y0, lh: lhS, cls: "body ink", size: sizeS })}
    ${textBlock(lines.slice(per), { x: 620, y: y0, lh: lhS, cls: "body ink", size: sizeS })}
  </g>
  <rect class="ink" x="600" y="${y0 - 20}" width="1" height="${per * lhS}" opacity=".35"/>
  ${readMore(w, 86, 40)}
  ${storyFooter(w, h, s.stack, 40)}`,
      css: `.blink { animation: blink 1.2s steps(1) infinite; } @keyframes blink { 50% { opacity: .25; } }`,
    });
  }

  if (s.layout === "slim") {
    const w = 1200, h = 220;
    const lines = wrap(s.standfirst, "LORA400", 18, 520);
    const head = wrap(s.headline, "PF700", 36, 540);
    return svgDoc({
      ...common, w, h,
      body: `  <rect class="rule ink" x="32" y="14" width="${w - 64}" height="2.5"/>
  <text class="mono red rise" x="32" y="50" font-size="12" letter-spacing="2.2" style="animation-delay:.2s">${esc(s.kicker)}</text>
  <g class="rise" style="animation-delay:.35s">${textBlock(head, { x: 30, y: 98, lh: 42, cls: "serif ink", size: 36, extra: 'font-weight="700"' })}</g>
  ${readMore(w, h - 20, 32)}
  <rect class="ink" x="608" y="40" width="1" height="100" opacity=".35"/>
  <g class="rise" style="animation-delay:.5s">${textBlock(lines, { x: 632, y: 62, lh: 26, cls: "body ink", size: 18 })}</g>
  ${storyFooter(w, h, s.stack)}`,
    });
  }

  // half-width story, shown two to a row
  const w = 600, h = 300;
  const head = wrap(s.headline, "PF700", 34, w - 64);
  const y0 = 92 + head.length * 40 + 8;
  const lines = wrap(s.standfirst, "LORA400", 18, w - 64);
  return svgDoc({
    ...common, w, h,
    body: `  <rect class="rule ink" x="32" y="14" width="${w - 64}" height="2.5"/>
  <text class="mono red rise" x="32" y="50" font-size="12" letter-spacing="2.2" style="animation-delay:.2s">${esc(s.kicker)}</text>
  ${readMore(w, 50, 32)}
  <g class="rise" style="animation-delay:${(0.3 + (i % 2) * 0.1).toFixed(1)}s">${textBlock(head, { x: 30, y: 92, lh: 40, cls: "serif ink", size: 34, extra: 'font-weight="700"' })}</g>
  <g class="rise" style="animation-delay:.5s">${textBlock(lines, { x: 32, y: y0, lh: 26, cls: "body ink", size: 18 })}</g>
  ${storyFooter(w, h, s.stack)}`,
  });
}

// ---------------------------------------------------------------- templated pieces

// Each tab is a link in the README; keep these in sync with its hrefs.
const TABS = [
  { file: "tab-email.svg", LABEL: "EMAIL", DETAIL: "jayakrishxn@gmail.com" },
  { file: "tab-linkedin.svg", LABEL: "LINKEDIN", DETAIL: "in/krishinfowork" },
  { file: "tab-portfolio.svg", LABEL: "PORTFOLIO", DETAIL: "jrkrish.github.io" },
  { file: "tab-github.svg", LABEL: "GITHUB", DETAIL: "github.com/Jrkrish" },
];

const TEMPLATE_FONTS = {
  FONT_PF900: "PF900", FONT_PF700: "PF700", FONT_PF400I: "PF400I", FONT_PM500: "PM500", FONT_CAV: "CAV", FONT_LORA400: "LORA400",
};

function fromTemplate(src, vars = {}) {
  const template = readFileSync(join(root, "assets/src", src), "utf8");
  return template.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    if (key in vars) return vars[key];
    if (key in TEMPLATE_FONTS) return fontData(TEMPLATE_FONTS[key]);
    throw new Error(`${src}: placeholder ${m} has no value`);
  });
}

// ---------------------------------------------------------------- build

save("profile.svg", profilePage());
save("markets.svg", marketsPage());
STORIES.forEach((s, i) => save(s.file, story(s, i)));
save("flyer.svg", fromTemplate("flyer.svg"));
save("tab-torn.svg", fromTemplate("tab-torn.svg"));
TABS.forEach(({ file, LABEL, DETAIL }, i) =>
  save(file, fromTemplate("tab.svg", { LABEL: esc(LABEL), DETAIL: esc(DETAIL), SWAY: (2.4 + i * 0.37).toFixed(2), DELAY: (i * -0.6).toFixed(1) })),
);
save("footer.svg", fromTemplate("footer.svg"));

