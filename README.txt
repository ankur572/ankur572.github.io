ANKUR DIXIT — ACADEMIC HYDROCLIMATE WEBSITE

Open index.html through a local web server for the most consistent behavior.

Suggested command on macOS:
    python3 -m http.server 8000
Then visit:
    http://localhost:8000/

Files:
- index.html: homepage, Recent Updates carousel, Selected Research, warming-stripes selector
- research.html: research themes
- publications.html: publications
- projects.html: projects
- about.html: academic biography and links
- cv.html: web CV
- profile.png: profile photograph
- assets/style.css: shared styling
- assets/warming.js: warming color selector + persistence across pages
- assets/updates.js: Recent Updates carousel

Before publishing:
1. Replace YOUR_EMAIL.
2. Replace placeholder publication/update/project text with real content.
3. Replace # links with Google Scholar / ORCID / GitHub / ResearchGate URLs.
4. Add your institution and appointment details to About/CV.

The warming selector appears only on index.html. The selected year/color is saved in localStorage and reused on all other pages.

Selected Research / recent publications
--------------------------------------
The homepage Selected Research section now shows recent publications with small local thumbnails.
Replace assets/publication-1.svg, publication-2.svg, and publication-3.svg with paper figures or images if desired.
Replace the sample titles/citations in index.html and publications.html.
On publications.html, replace each href="#" in the Paper links with the DOI or publisher URL.
