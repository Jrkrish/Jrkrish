// Builds the two pages that change every day, using today's date (IST) and
// live data from the GitHub API:
//
//   header.svg   the front page, from assets/src/header.svg
//   numbers.svg  "By the numbers", with the contribution snake as the daily puzzle
//
//   node scripts/build-daily.mjs [outDir] [snake.svg]
//
// outDir defaults to dist/, and the snake to <outDir>/github-snake.svg; the
// puzzle is left out when there is no snake. GITHUB_TOKEN is optional and only
// raises the API rate limit. If the API is unreachable both pages are still
// written with fallbacks, so the published profile never loses them.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INK, PAPER, esc, folio, fontData, root, svgDoc, textWidth } from "./lib.mjs";

const outDir = process.argv[2] ?? join(root, "dist");
const snakePath = process.argv[3] ?? join(outDir, "github-snake.svg");
const user = process.env.PROFILE_USER ?? "Jrkrish";
const token = process.env.GITHUB_TOKEN;
const SOURCE = "scripts/build-daily.mjs";

const HEADLINE_W = 735; // the front page's story column
const BYLINE_MAX = 82;
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": `${user}-profile`,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`GET ${path}: HTTP ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------- date, in India Standard Time

const now = new Date();
const ist = (opts, d = now) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", ...opts }).format(d);
const year = Number(ist({ year: "numeric" }));
const dayOfYear = Math.round(
  (Date.UTC(year, Number(ist({ month: "numeric" })) - 1, Number(ist({ day: "numeric" }))) - Date.UTC(year, 0, 0)) / 86_400_000,
);
const longDate = ist({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");

// ---------------------------------------------------------------- live data

let profile = null;
let repos = [];
try {
  profile = await gh(`/users/${user}`);
  repos = (await gh(`/users/${user}/repos?per_page=100&sort=pushed`)).filter(
    (r) => !r.fork && !r.private && !r.archived && r.name.toLowerCase() !== user.toLowerCase(),
  );
} catch (err) {
  console.warn(`GitHub API unavailable, using fallbacks: ${err.message}`);
}
const latest = repos[0];

// ---------------------------------------------------------------- front page

function headerPage() {
  // Shrink a long repo name until it fits the headline column.
  const fit = (text, size) => {
    let t = text;
    while (textWidth(t, "PF700", size) > HEADLINE_W && t.length > 4) t = t.slice(0, -2) + "…";
    return t;
  };
  const live = latest
    ? {
        l1: "Fresh commits land in",
        l2: fit(latest.name, 45),
        byline: clip(
          `Pushed ${ist({ day: "numeric", month: "long" }, new Date(latest.pushed_at))} · ${latest.language ?? "code"} · github.com/${user}/${latest.name}`,
          BYLINE_MAX,
        ),
        desc: `Just in: fresh commits land in ${latest.name}.`,
      }
    : { l1: "Fresh code lands on GitHub", l2: "almost every week", byline: `Follow along at github.com/${user}`, desc: "" };

  const facts = [
    ...(profile ? [`${profile.public_repos} PUBLIC REPOS`] : []),
    ...(latest ? [`LATEST PUSH: ${latest.name.toUpperCase()}`] : []),
  ];
  const ticker =
    [...facts, "OPEN TO OPPORTUNITIES", "YOLOv8 FINDS VERTEBRAE", "LLM AGENTS PASS THEIR TESTS", "COFFEE LEVELS CRITICAL"].join("  •  ") +
    "  •  ";
  const tickerLen = Math.max(1100, Math.round(textWidth(ticker, "PM500", 14, 1.5)));
  const tickerShift = tickerLen + 40;

  const values = {
    FONT_PF900: fontData("PF900"),
    FONT_PF700: fontData("PF700"),
    FONT_PF400I: fontData("PF400I"),
    FONT_PM500: fontData("PM500"),
    DATE_TITLE: esc(longDate),
    EDITION: esc(`VOL. ${year} · NO. ${dayOfYear}`),
    DATELINE: esc(`${longDate} · Tamil Nadu, India`.toUpperCase()),
    LIVE_L1: esc(live.l1),
    LIVE_L2: esc(live.l2),
    LIVE_BYLINE: esc(live.byline),
    LIVE_DESC: esc(live.desc),
    TICKER: esc(ticker),
    TICKER_LEN: tickerLen,
    TICKER_X2: 150 + tickerShift,
    TICKER_SHIFT: tickerShift,
    TICKER_DUR: (tickerShift / 48).toFixed(1),
  };
  const template = readFileSync(join(root, "assets/src/header.svg"), "utf8");
  return template.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    if (!(key in values)) throw new Error(`header template placeholder ${m} has no value`);
    return values[key];
  });
}

// ---------------------------------------------------------------- by the numbers

// The snake is generated GitHub-green; reprint it in newspaper ink.
const SNAKE_INK = "--cb:#16130F14;--cs:#B3261E;--ce:#E6DCC6;--c0:#E6DCC6;--c1:#C9B48F;--c2:#A68B5B;--c3:#6F5634;--c4:#16130F";

function embedSnake(x, y, width) {
  const svg = readFileSync(snakePath, "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${snakePath}: no viewBox`);
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
  const height = Math.round((width * vh) / vw);
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<desc>[\s\S]*?<\/desc>/, "")
    .replace(/:root\s*\{[^}]*\}/, `:root{${SNAKE_INK}}`);
  return { height, markup: `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}">${inner}</svg>` };
}

function numbersPage() {
  const w = 1200;
  const langs = Object.entries(
    repos.reduce((acc, r) => (r.language ? { ...acc, [r.language]: (acc[r.language] ?? 0) + 1 } : acc), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const since = profile ? new Date(profile.created_at).getUTCFullYear() : "2024";
  const figures = [
    [profile?.public_repos ?? "30+", "PUBLIC REPOS"],
    [langs.length || "6", "LANGUAGES IN USE"],
    [since, "ON GITHUB SINCE"],
    [latest ? ist({ day: "numeric", month: "short" }, new Date(latest.pushed_at)).toUpperCase() : "DAILY", "LATEST PUSH"],
  ];

  const top = 172;
  const figureBoxes = figures
    .map(([n, label], i) => {
      const x = 40 + (i % 2) * 285, y = top + Math.floor(i / 2) * 118;
      return `
    <g class="rise" style="animation-delay:${(0.4 + i * 0.12).toFixed(2)}s">
      <rect x="${x}" y="${y}" width="270" height="104" fill="none" stroke="${INK}" stroke-width="1.2"/>
      <text class="serif ink" x="${x + 18}" y="${y + 66}" font-size="56" font-weight="900">${esc(n)}</text>
      <text class="mono red" x="${x + 18}" y="${y + 90}" font-size="11.5" letter-spacing="2">${esc(label)}</text>
    </g>`;
    })
    .join("");

  const max = Math.max(1, ...langs.map(([, n]) => n));
  const bx = 800, bw = 300, rowH = 37;
  const bars = langs
    .map(([lang, n], i) => {
      const y = top + 40 + i * rowH;
      return `
    <text class="mono ink" x="650" y="${y + 16}" font-size="13">${esc(lang.toUpperCase())}</text>
    <rect class="bar" x="${bx}" y="${y}" width="${Math.max(6, (n / max) * bw).toFixed(1)}" height="22" fill="url(#dots)" stroke="${INK}" stroke-width="1" style="animation-delay:${(0.6 + i * 0.1).toFixed(2)}s"/>
    <text class="mono ink" x="${bx + (n / max) * bw + 12}" y="${y + 16}" font-size="13">${n}</text>`;
    })
    .join("");

  let puzzle = "";
  let h = top + 2 * 118 + 40;
  if (existsSync(snakePath)) {
    const py = h;
    const snake = embedSnake(40, py + 70, 1120);
    puzzle = `
  <rect class="ink" x="40" y="${py}" width="1120" height="2.5"/>
  <text class="mono red" x="40" y="${py + 32}" font-size="13" letter-spacing="2.2">THE DAILY PUZZLE</text>
  <text class="serif ink" x="1160" y="${py + 34}" font-size="18" font-style="italic" text-anchor="end">Our snake clears the contribution grid, one square at a time.</text>
  ${snake.markup}`;
    h = py + 70 + snake.height + 10;
  }

  return svgDoc({
    w, h, source: SOURCE,
    title: "By the numbers",
    desc: `${figures.map(([n, l]) => `${l.toLowerCase()}: ${n}`).join(", ")}. Languages by repo: ${langs.map(([l, n]) => `${l} ${n}`).join(", ")}.`,
    fonts: ["PF900", "PF400I", "PM500"],
    defs: `<pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="${PAPER}"/><circle cx="2.5" cy="2.5" r="1.5" fill="${INK}"/></pattern>`,
    css: `
      .bar { transform-box: fill-box; transform-origin: left center; animation: grow 1s cubic-bezier(.2,.7,.2,1) both; }
      @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`,
    body: `${folio(w, "BY THE NUMBERS", "PAGE E1")}
  <text class="mono red rise" x="40" y="84" font-size="13" letter-spacing="2.2" style="animation-delay:.2s">STATISTICS DESK</text>
  <text class="serif ink rise" x="38" y="132" font-size="44" font-weight="900" style="animation-delay:.3s">By the numbers</text>
  <text class="serif ink rise" x="1160" y="132" font-size="18" font-style="italic" text-anchor="end" style="animation-delay:.4s">Fresh from the GitHub API, reprinted every night at 00:05 IST.</text>
  <rect class="ink" x="40" y="152" width="1120" height="1" opacity=".5"/>${figureBoxes}
  <rect class="ink" x="620" y="${top}" width="1" height="222" opacity=".35"/>
  <text class="mono red" x="650" y="${top + 14}" font-size="12" letter-spacing="2">LANGUAGE REPORT · REPOS BY PRIMARY LANGUAGE</text>${bars}${puzzle}`,
  });
}

// ---------------------------------------------------------------- write

mkdirSync(outDir, { recursive: true });
for (const [name, svg] of [["header.svg", headerPage()], ["numbers.svg", numbersPage()]]) {
  writeFileSync(join(outDir, name), svg);
  console.log(`${join(outDir, name)} (${svg.length} bytes)`);
}
console.log(`edition ${dayOfYear} · latest push: ${latest?.name ?? "unknown"} · snake: ${existsSync(snakePath) ? "yes" : "no"}`);
