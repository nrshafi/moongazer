# JetBrains Mono (P5, T5.4)

- Source: https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip (official release, tag v2.304, SIL OFL 1.1)
- Release ZIP SHA-256: 6F6376C6ED2960EA8A963CD7387EC9D76E3F629125BC33D1FDCD7EB7012F7BBF
- Source font `fonts/variable/JetBrainsMono[wght].ttf` (kept here as `jetbrains-mono.ttf`) SHA-256: 662A196D58F1183BF2D77428B6D5283FE3F45161AB021BEA4036BC98E5CAC016
- Licence: `jetbrains-mono-OFL.txt` (from the release ZIP)
- Derivative `jetbrains-mono.woff2` SHA-256: 685B40D64E687684A0590921CFF8E7F1A6179484A32C53BFC1C0C54EDA971A9D (35,572 bytes)
- Toolchain: fontTools 4.68.0 `pyftsubset` plus Brotli, installed in an isolated virtual environment outside the repo (the same fontTools WOFF2 approach as `deployment/seo-assets.py`, plus a subset step):
  `pyftsubset "JetBrainsMono[wght].ttf" --unicodes="U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2192" --flavor=woff2 --layout-features="kern,liga,calt,tnum,zero"`
- Scope: Latin, digits and punctuation, variable weight axis 100-800. Shipped only to the eight Playboard and Dossier apps: guess-the-surah, ayah-threads, word-groups, is-it-in-the-quran, places-in-the-quran, seerah-timeline, seerah-detective, civilization-timeline (`public/fonts/jetbrains-mono.woff2` plus the licence text; `@font-face` and `.mono-chip` at the end of each `global.css`).
