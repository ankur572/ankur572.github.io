(() => {
  const DATA_URL = "data/updates.xlsx";
  const SHEET_NAME = "Updates";

  const track = document.getElementById("updatesTrack");
  const prev = document.getElementById("updatePrev");
  const next = document.getElementById("updateNext");
  if (!track || !prev || !next) return;

  let cards = [];
  let index = 0;

  const escapeHTML = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function safeHref(value){
    const href = String(value ?? "").trim();
    if (!href || /^javascript:/i.test(href) || /^data:/i.test(href)) return "";
    if (/^(https?:\/\/|mailto:|#|\.\.?\/)/i.test(href)) return href;
    if (/^[a-z0-9][a-z0-9_./?=#&%+~-]*$/i.test(href)) return href;
    return "";
  }

  function visibleCount(){
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function maxIndex(){
    return Math.max(0, cards.length - visibleCount());
  }

  function draw(){
    index = Math.min(index, maxIndex());
    const first = cards[0];
    if (!first){
      prev.disabled = true;
      next.disabled = true;
      return;
    }
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
    const step = first.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${index * step}px)`;
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex();
  }

  function render(records){
    // Excel is the source of truth: only rows explicitly marked Yes in Display are shown.
    const usable = records.filter(row => {
      const display = String(row.Display ?? "").trim().toLowerCase();
      if (display !== "yes") return false;
      return String(row.Date ?? "").trim() ||
             String(row.Title ?? "").trim() ||
             String(row.Description ?? "").trim() ||
             String(row.Venue ?? "").trim();
    });

    if (!usable.length){
      track.innerHTML = '<div class="updates-message">No updates are currently marked “Yes” in the Display column.</div>';
      cards = [];
      draw();
      return;
    }

    track.innerHTML = usable.map(row => {
      const date = escapeHTML(row.Date);
      const title = escapeHTML(row.Title);
      const description = escapeHTML(row.Description);
      const venue = escapeHTML(row.Venue);
      const linkText = escapeHTML(row["Link String"]);
      const href = safeHref(row["Actual Hyperlink"]);

      const metaParts = [];
      if (date) metaParts.push(`<span class="update-date">${date}</span>`);
      if (title) metaParts.push(`<span class="update-title">${title}</span>`);

      return `
        <article class="update-card">
          ${metaParts.length ? `<div class="update-meta-line">${metaParts.join('<span class="update-dot" aria-hidden="true">·</span>')}</div>` : ""}
          ${description ? `<h3 class="update-description">${description}</h3>` : ""}
          ${venue ? `<div class="update-venue">${venue}</div>` : ""}
          ${linkText && href ? `<a class="update-link" href="${escapeHTML(href)}"${/^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener"' : ""}>${linkText}</a>` : ""}
        </article>`;
    }).join("");

    cards = [...track.querySelectorAll(".update-card")];
    index = 0;
    requestAnimationFrame(draw);
  }

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    draw();
  });

  next.addEventListener("click", () => {
    index = Math.min(maxIndex(), index + 1);
    draw();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(draw, 80);
  });

  async function load(){
    try{
      if (typeof XLSX === "undefined") throw new Error("Spreadsheet reader did not load.");
      const response = await fetch(DATA_URL, {cache: "no-store"});
      if (!response.ok) throw new Error(`Could not load ${DATA_URL} (${response.status}).`);
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, {type: "array"});
      const sheet = workbook.Sheets[SHEET_NAME];
      if (!sheet) throw new Error(`Worksheet “${SHEET_NAME}” was not found.`);
      const records = XLSX.utils.sheet_to_json(sheet, {defval: "", raw: false});
      render(records);
    }catch(error){
      console.error(error);
      track.innerHTML = `
        <div class="updates-message updates-error">
          Updates could not be loaded. Confirm that <code>${DATA_URL}</code> exists and view the site through a web server or GitHub Pages rather than as a local <code>file://</code> page.
        </div>`;
      cards = [];
      draw();
    }
  }

  load();
})();
