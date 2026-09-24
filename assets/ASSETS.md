# Original profile artwork

All artwork in this directory was created specifically for He Yu / djyking. It combines original vector artwork with an original AI-generated illustration, rather than copying the reference profile. No third-party fonts, image hosts, tracking, or live-stat services are required.

- `workbench-hero.svg` — 1200 × 480 illustrated scene based on the selected concept C: a front-facing cartoon engineer sits behind a laptop, looking at its inner screen; the viewer sees the plain outer lid. It embeds the illustration as a JPEG and adds subtle CSS pulses at AI diagram nodes, a small highlight along the research graph, and a warm lamp glow. The face, body, and laptop remain still. Reduced-motion preferences disable all decorative animation.
- `workbench-c-base.png` — original AI-generated raster for the approved concept C composition, with its draft concept label removed. `build-hero-c.mjs` retains this source unchanged and compresses a copy to JPEG (quality 94, 4:4:4 chroma) for the banner. No code or screen contents are placed on the outer laptop lid.
- `avatar.svg` / `avatar.png` — 512 × 512 original cartoon portrait based only on the requested traits: male, black hair, glasses. This is an illustrated identity asset, not a claim to be a realistic portrait.
- `opsagent-card.svg` — 1200 × 284 animated project link artwork. README text carries the exact public project status and demo link.
- `focus-*.svg` — three matching static theme labels. Data exploration is explicitly described as an interest.

SVG files use local vector shapes, CSS, and (for the banner) an embedded raster; they have no JavaScript, foreignObject, external images, or remote font dependencies. GitHub renders them as images, so links and substantive project descriptions belong in the surrounding README.

PNG/SVG previews under `.preview/` are for visual review and need not be published. `python build-art.py` rebuilds the original vector asset set, including the superseded banner. Run `node build-hero-c.mjs` **afterward** to restore the current approved banner. The Node build requires `sharp`; install it locally or expose an existing installation through `NODE_PATH`.

For a provisional composition review, run `node build-hero-c.mjs --preview-source /path/to/concept-c.png`. This writes only `.preview/hero-c-provisional.svg` and its PNG, leaving the production banner unchanged. The default build reads `assets/workbench-c-base.png` and writes `assets/workbench-hero.svg` plus a local PNG review copy.

Animation coordinates are based on the approved 1983 × 793 concept image and a 1200 × 480 SVG viewBox. If the illustration composition changes, inspect and realign the AI nodes, research graph, and lamp glow before publishing; changing the source filename alone is not sufficient.
