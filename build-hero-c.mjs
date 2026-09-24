#!/usr/bin/env node
/**
 * Rebuild the approved front-facing laptop banner without changing its artwork.
 *
 * Production: node build-hero-c.mjs
 * Review only: node build-hero-c.mjs --preview-source /path/to/concept-c.png
 *
 * Requires sharp (npm package, or expose an existing installation via NODE_PATH).
 * The source PNG is retained unchanged. Only its encoding is converted to JPEG
 * for a smaller self-contained SVG; no cropping, painting, or semantic edits.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch {
  throw new Error('This build requires sharp. Install it locally or set NODE_PATH to an existing node_modules directory.');
}

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
if (args.length !== 0 && !(args.length === 2 && args[0] === '--preview-source')) {
  throw new Error('Usage: node build-hero-c.mjs [--preview-source /path/to/concept-c.png]');
}
const provisional = args[0] === '--preview-source';
const source = provisional ? path.resolve(args[1]) : path.join(root, 'assets/workbench-c-base.png');
const target = path.join(root, provisional ? 'assets/.preview/hero-c-provisional.svg' : 'assets/workbench-hero.svg');
const sourceBytes = await fs.readFile(source);
const meta = await sharp(sourceBytes).metadata();
if (!meta.width || !meta.height || Math.abs(meta.width / meta.height - 2.5) > 0.02) {
  throw new Error(`Expected the approved 5:2 composition, received ${meta.width} × ${meta.height}. Review the illustration before building.`);
}

// Keep the raster at its original resolution for crisp text on HiDPI displays.
// 4:4:4 avoids chroma fringes around the teal lettering and thin diagram lines.
const jpeg = await sharp(sourceBytes)
  .flatten({ background: '#0b1727' })
  .jpeg({ quality: 94, chromaSubsampling: '4:4:4', progressive: true, mozjpeg: false })
  .toBuffer();

// Coordinate reference: approved concept C at 1983 × 793 pixels, mapped onto
// a 1200 × 480 viewBox. These elements follow existing diagram nodes and lines;
// they never move the face, body, laptop, or the complete bitmap.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-labelledby="hero-title hero-description">
  <title id="hero-title">He Yu — a personal AI and data workbench</title>
  <desc id="hero-description">A cartoon engineer with black hair and glasses faces the inner screen of a laptop. Viewers see his face above the plain outer laptop lid. Research graphs and an AI diagram accompany a softly lit desk at night.</desc>
  <defs>
    <radialGradient id="lamp-light">
      <stop offset="0" stop-color="#ffe2aa" stop-opacity="0.8"/>
      <stop offset="0.55" stop-color="#ffe2aa" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#ffe2aa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <style>
    .ai-pulse { fill: none; stroke: #82ffdf; stroke-width: 1.05; opacity: .14; animation: node-light 7.5s ease-in-out infinite; }
    .ai-pulse.second { animation-delay: -2.5s; }
    .ai-pulse.third { animation-delay: -5s; }
    .graph-flow { fill: none; stroke: #e0fff7; stroke-width: 1.55; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4 116; stroke-dashoffset: 120; opacity: .54; animation: graph-flow 10s linear infinite; }
    .lamp-glow { fill: url(#lamp-light); opacity: .035; animation: lamp-breathe 12s ease-in-out infinite; }
    @keyframes node-light { 0%, 100% { opacity: .08; } 50% { opacity: .38; } }
    @keyframes graph-flow { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
    @keyframes lamp-breathe { 0%, 100% { opacity: .02; } 50% { opacity: .075; } }
    @media (prefers-reduced-motion: reduce) {
      .ai-pulse, .graph-flow, .lamp-glow { animation: none; opacity: 0; }
    }
  </style>
  <image x="0" y="0" width="1200" height="480" preserveAspectRatio="none" href="data:image/jpeg;base64,${jpeg.toString('base64')}"/>
  <g aria-hidden="true">
    <ellipse class="lamp-glow" cx="1035" cy="330" rx="104" ry="83"/>
    <circle class="ai-pulse" cx="476.25" cy="136.80" r="8.25"/>
    <circle class="ai-pulse second" cx="522.84" cy="168.88" r="8.25"/>
    <circle class="ai-pulse third" cx="478.06" cy="203.98" r="8.25"/>
    <path class="graph-flow" pathLength="120" d="M776.40 174.93 L796.97 164.03 L819.97 171.30 L844.78 149.50 L867.77 154.96 L891.38 136.19 L915.58 144.06 L939.18 130.74"/>
  </g>
</svg>
`;

if (/<(?:script|foreignObject)\b/i.test(svg) || /(?:href|src)="https?:/i.test(svg)) {
  throw new Error('Unexpected executable or externally hosted content in the generated SVG.');
}
await fs.mkdir(path.dirname(target), { recursive: true });
await fs.writeFile(target, svg, 'utf8');

// A local static PNG allows layout and overlay alignment review. It is excluded
// from publication by the repository's assets/.preview/ ignore rule.
const preview = path.join(root, 'assets/.preview', provisional ? 'hero-c-provisional.png' : 'workbench-hero-c.png');
await fs.mkdir(path.dirname(preview), { recursive: true });
await sharp(Buffer.from(svg), { density: 144 }).png().toFile(preview);

console.log(JSON.stringify({
  source,
  sourceSize: `${meta.width}x${meta.height}`,
  sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
  embeddedJpegBytes: jpeg.length,
  svgBytes: Buffer.byteLength(svg),
  target,
  preview,
  provisional,
}, null, 2));
