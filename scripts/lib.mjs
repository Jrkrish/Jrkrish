// Shared pieces for the newspaper SVGs: fonts, text measuring, paper, folios.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export const INK = "#16130F";
export const RED = "#B3261E";
export const PAPER = "#F2EADB";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// key -> [file, family, weight, style]
const FONTS = {
  PF900: ["playfair-display-latin-900-normal.woff2", "PF", 900, "normal"],
  PF700: ["playfair-display-latin-700-normal.woff2", "PF", 700, "normal"],
  PF400I: ["playfair-display-latin-400-italic.woff2", "PF", 400, "italic"],
  PM500: ["ibm-plex-mono-latin-500-normal.woff2", "PM", 500, "normal"],
  CAV: ["caveat-latin-700-normal.woff2", "CV", 700, "normal"],
  LORA400: ["lora-latin-400-normal.woff2", "LR", 400, "normal"],
};

const fontCache = {};
export function fontData(key) {
  return (fontCache[key] ??=
    "data:font/woff2;base64," + readFileSync(join(root, "assets/fonts", FONTS[key][0])).toString("base64"));
}

export function fontFaces(keys) {
  return keys
    .map((k) => {
      const [, family, weight, style] = FONTS[k];
      return `@font-face { font-family: '${family}'; font-weight: ${weight}; font-style: ${style}; src: url(${fontData(k)}) format('woff2'); }`;
    })
    .join("\n      ");
}

// Advance widths per character, in em, generated from the font files.
const metrics = JSON.parse(readFileSync(join(root, "scripts/font-metrics.json"), "utf8"));

export function textWidth(text, key, size, letterSpacing = 0) {
  const m = metrics[key];
  let w = 0;
  for (const ch of text) w += (m[ch] ?? 0.55) * size + letterSpacing;
  return w;
}

// Greedy word wrap. `width` is a number or a function of the line index,
// so the first lines can make room for a drop cap.
export function wrap(text, key, size, width) {
  const widthAt = typeof width === "function" ? width : () => width;
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(next, key, size) > widthAt(lines.length)) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export const BASE_CSS = `
      .serif { font-family: 'PF', Georgia, 'Times New Roman', serif; }
      .mono  { font-family: 'PM', 'Courier New', monospace; font-weight: 500; }
      .body  { font-family: 'LR', Georgia, 'Times New Roman', serif; }
      .hand  { font-family: 'CV', 'Comic Sans MS', cursive; font-weight: 700; }
      .ink   { fill: ${INK}; }
      .red   { fill: ${RED}; }
      .rule  { transform-box: fill-box; transform-origin: center; animation: rule .9s cubic-bezier(.2,.7,.2,1) both; }
      .rise  { animation: rise .7s ease-out both; }
      @keyframes rule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`;

const REDUCED = `
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`;

export function svgDoc({ w, h, title, desc = "", fonts, css = "", body, defs = "", source }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
  <title id="t">${esc(title)}</title>
  <desc id="d">${esc(desc)}</desc>
  <!-- Built by ${source}. Fonts: Playfair Display, IBM Plex Mono, Lora, Caveat, all SIL OFL 1.1, embedded unmodified. -->
  <defs>
    <style>
      ${fontFaces(fonts)}
      ${BASE_CSS}
      ${css}
      ${REDUCED}
    </style>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .10"/></feComponentTransfer>
    </filter>
    ${defs}
  </defs>
  <rect width="${w}" height="${h}" fill="${PAPER}"/>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
${body}
</svg>
`;
}

// The running strip at the top of each inside page.
export function folio(w, section, page) {
  return `  <g class="mono ink" font-size="12" letter-spacing="2.2">
    <text x="40" y="28">THE JAYAKRISHNAN TIMES</text>
    <text x="${w / 2}" y="28" text-anchor="middle">${esc(section)}</text>
    <text x="${w - 40}" y="28" text-anchor="end">${esc(page)}</text>
  </g>
  <rect class="rule ink" x="40" y="38" width="${w - 80}" height="2.5"/>
  <rect class="rule ink" x="40" y="44" width="${w - 80}" height="1" style="animation-delay:.1s"/>`;
}

// Lines of text as one <text> with <tspan>s.
export function textBlock(lines, { x, y, lh, cls, size, extra = "" }) {
  const spans = lines.map((l, i) => `<tspan x="${x}" y="${y + i * lh}">${esc(l)}</tspan>`).join("");
  return `<text class="${cls}" font-size="${size}" ${extra}>${spans}</text>`;
}

// Small up-right arrow, drawn rather than typed: none of the fonts have one.
export const arrow = (x, y, s = 10, stroke = RED) =>
  `<path d="M${x} ${y + s}L${x + s} ${y}M${x + s * 0.3} ${y}H${x + s}V${y + s * 0.7}" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
