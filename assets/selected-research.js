(() => {
  const DATA_URL = "data/selected-research.xlsx";
  const SHEET_NAME = "Selected Research";
  const container = document.getElementById("selectedResearch");
  if (!container) return;

  const escapeHTML = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function createLightbox() {
    let box = document.getElementById("publicationLightbox");
    if (box) return box;
    box = document.createElement("div");
    box.id = "publicationLightbox";
    box.className = "publication-lightbox";
    box.hidden = true;
    box.innerHTML = `
      <button class="publication-lightbox-close" type="button" aria-label="Close image">×</button>
      <img class="publication-lightbox-image" alt="Expanded publication figure">
    `;
    document.body.appendChild(box);
    const close = () => {
      box.hidden = true;
      document.body.classList.remove("lightbox-open");
      box.querySelector("img").removeAttribute("src");
    };
    box.querySelector("button").addEventListener("click", close);
    box.addEventListener("click", e => { if (e.target === box) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) close(); });
    box._close = close;
    return box;
  }

  function render(rows) {
    const records = rows.filter(row => row.Title || row.Year || row["Photo Filename"]);
    if (!records.length) {
      container.innerHTML = '<div class="publications-message">No selected research entries found.</div>';
      return;
    }

    container.innerHTML = records.map((row, i) => {
      const filename = String(row["Photo Filename"] || "").trim();
      const authors = row["Author and Journal Details"] || row.Authors || "";
      const journal = row.Journal || "";
      const paperURL = row["Paper URL"] || row.URL || "";
      const abstract = row.Abstract || "";
      const panelId = `selected-abstract-${i}`;

      const image = filename
        ? `<div class="publication-image-div">
             <img class="publication-image" src="${escapeHTML(filename)}" data-zoom-image tabindex="0" alt="Figure for ${escapeHTML(row.Title || "selected publication")}" loading="lazy">
           </div>`
        : `<div class="publication-image-div image-missing"><span class="publication-image-placeholder">No image</span></div>`;

      const citation = [
        authors ? `<span class="publication-authors">${escapeHTML(authors)}</span>` : "",
        journal ? `<em class="publication-journal">${escapeHTML(journal)}</em>` : ""
      ].filter(Boolean).join(authors && journal ? " · " : "");

      return `<article class="selected-publication">
        <div class="publication-media">${image}</div>
        <div class="publication-main">
          <div class="publication-year">${escapeHTML(row.Year || "")}</div>
          <h3>${escapeHTML(row.Title || "")}</h3>
          ${citation ? `<div class="publication-citation">${citation}</div>` : ""}
          <div class="publication-actions">
            ${abstract ? `<button class="abstract-toggle" type="button" aria-expanded="false" aria-controls="${panelId}">Abstract <span aria-hidden="true">↓</span></button>` : `<span></span>`}
            ${paperURL ? `<a class="paper-link" href="${escapeHTML(paperURL)}" target="_blank" rel="noopener">Paper →</a>` : ""}
          </div>
          ${abstract ? `<div class="abstract-panel" id="${panelId}" hidden><div class="abstract-inner"><p>${escapeHTML(abstract)}</p></div></div>` : ""}
        </div>
      </article>`;
    }).join("");

    const lightbox = createLightbox();
    const open = img => {
      const preview = lightbox.querySelector(".publication-lightbox-image");
      preview.src = img.currentSrc || img.src;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightbox.querySelector("button").focus();
    };

    container.querySelectorAll("[data-zoom-image]").forEach(img => {
      img.addEventListener("click", () => open(img));
      img.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); }
      });
      img.addEventListener("error", () => {
        const holder = img.closest(".publication-image-div");
        holder.classList.add("image-missing");
        holder.innerHTML = `<span class="publication-image-placeholder">Image not found: ${escapeHTML(img.getAttribute("src") || "")}</span>`;
      }, {once:true});
    });

    container.querySelectorAll(".abstract-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        if (!panel) return;
        const opening = panel.hidden;
        panel.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.innerHTML = opening ? 'Abstract <span aria-hidden="true">↑</span>' : 'Abstract <span aria-hidden="true">↓</span>';
      });
    });
  }

  async function load() {
    try {
      if (typeof XLSX === "undefined") throw new Error("Spreadsheet reader did not load.");
      const response = await fetch(`${DATA_URL}?v=10`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Could not load ${DATA_URL} (${response.status}).`);
      const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[SHEET_NAME] || workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) throw new Error("Selected research worksheet was not found.");
      render(XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false }));
    } catch (error) {
      console.error(error);
      container.innerHTML = '<div class="publications-message publications-error">Selected research could not be loaded.</div>';
    }
  }

  load();
})();
