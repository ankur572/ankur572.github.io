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
- news.html: dedicated news and updates page
- data.html: data, code, and research resources page
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


Contact form
------------
The homepage includes a two-field contact form (email + message).
Because GitHub Pages is static hosting, the form needs a form backend.
The template is configured for Formspree:

1. Create a form at https://formspree.io/
2. Copy the form ID from the endpoint they give you.
3. In index.html replace YOUR_FORM_ID in:
       https://formspree.io/f/YOUR_FORM_ID
4. Replace YOUR_EMAIL with your preferred direct-contact email address.

Until YOUR_FORM_ID is replaced, the Send message button will not deliver submissions.

PUBLICATION FILTER / EXCEL DATA
-------------------------------
The Publications page now reads its content from:
  data/publications.xlsx

Worksheet name:
  Publications

Required columns:
  Year | Type | Title | Authors | Venue | Details | URL

Allowed Type values used by the filters:
  Articles
  Presentation
  Poster
  Reports/Chapter
  Seminar/Invited talk

Edit the Excel file, keep the worksheet/column names the same, commit it to GitHub,
and the Publications page will load the updated entries automatically.

The page uses fetch/AJAX plus SheetJS. It works on GitHub Pages. For local testing,
serve the folder through a local web server (for example: python3 -m http.server 8000)
rather than double-clicking publications.html, because browsers may block fetch() on file:// pages.

HEADER NAVIGATION
-----------------
News and Data appear as palette-aware pill buttons in the top navigation on all pages.
Their border, text, hover, and active-page styling use the same warming palette variables selected on the homepage.


RECENT UPDATES SPREADSHEET
--------------------------
The home-page Recent Updates slider is populated from data/updates.xlsx, worksheet "Updates".
Keep these five column headers exactly as written:
1. Date
2. Title
3. Description
4. Link String
5. Actual Hyperlink

Each spreadsheet row becomes one slider card, and rows are displayed in the same order as the spreadsheet.
"Link String" is the text visitors see (for example, "View publication →").
"Actual Hyperlink" is the destination URL or local page (for example, https://doi.org/... or publications.html).
You can add as many rows as you like; the arrow controls will make all cards accessible.

Because browsers block fetch() from file:// pages, preview the site through GitHub Pages or a local web server.
