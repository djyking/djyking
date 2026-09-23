# Original profile artwork

All artwork in this directory was created specifically for He Yu / djyking. It is an original vector illustration, not a copy of the reference profile. No third-party fonts, image hosts, tracking, or live-stat services are required.

- `workbench-hero.svg` — 1200 × 480 illustrated scene. CSS animations gently move research and AI cards, highlight graph connections, and blink an editor cursor. A reduced-motion media query disables all movement.
- `avatar.svg` / `avatar.png` — 512 × 512 original cartoon portrait based only on the requested traits: male, black hair, glasses. This is an illustrated identity asset, not a claim to be a realistic portrait.
- `opsagent-card.svg` — 1200 × 284 animated project link artwork. README text carries the exact public project status and demo link.
- `focus-*.svg` — three matching static theme labels. Data exploration is explicitly described as an interest.

SVG files use only local vector shapes and CSS; they have no JavaScript, foreignObject, external images, or remote font dependencies. GitHub renders them as images, so links and substantive project descriptions belong in the surrounding README.

PNG previews under `.preview/` are for visual review and need not be published. Rebuild sources using `python build-art.py` from the repository root; rasterization is a separate local step.
