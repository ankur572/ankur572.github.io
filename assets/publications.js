(() => {
  const DATA_URL = "data/publications.xlsx";
  const SHEET_NAME = "Publications";

  const results = document.getElementById("publicationResults");
  const count = document.getElementById("publicationCount");
  const filters = [...document.querySelectorAll('#publicationFilters input[type="checkbox"]')];
  const progress = document.getElementById("publicationProgress");
  const selectAll = document.getElementById("selectAllPublications");
  const clear = document.getElementById("clearPublications");

  if (!results || !filters.length) return;

  let records = [];
  let updateTimer = null;

  const escapeHTML = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function safeUrl(value){
    const url = String(value ?? "").trim();
    return /^https?:\/\//i.test(url) ? url : "";
  }

  function selectedTypes(){
    return new Set(filters.filter(box => box.checked).map(box => box.value));
  }

  function startTransition(){
    results.classList.add("is-changing");
    results.setAttribute("aria-busy", "true");
    progress?.classList.remove("active");
    void progress?.offsetWidth;
    progress?.classList.add("active");
  }

  function finishTransition(){
    requestAnimationFrame(() => {
      results.classList.remove("is-changing");
      results.setAttribute("aria-busy", "false");
    });
    window.setTimeout(() => progress?.classList.remove("active"), 520);
  }

  function render(){
    const active = selectedTypes();
    const filtered = records
      .filter(row => String(row.Display || "").trim().toLowerCase() === "yes")
      .filter(row => active.has(String(row.Type || "").trim()))
      .sort((a,b) => {
        const ay = String(a.Year || "").trim();
        const by = String(b.Year || "").trim();
        const as = ay.toLowerCase() === "submitted";
        const bs = by.toLowerCase() === "submitted";
        if (as !== bs) return as ? -1 : 1;
        return (Number(by) || 0) - (Number(ay) || 0) || Number(a.__order) - Number(b.__order);
      });

    count.textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;

    if (!active.size){
      results.innerHTML = `<div class="publication-empty"><strong>No category selected.</strong>Select one or more output types above to display the scholarly record.</div>`;
      finishTransition();
      return;
    }

    if (!filtered.length){
      results.innerHTML = `<div class="publication-empty"><strong>No matching records.</strong>There are no entries for the selected categories in the spreadsheet.</div>`;
      finishTransition();
      return;
    }

    results.innerHTML = filtered.map((row, itemIndex) => {
      const href = safeUrl(row.URL);
      const venue = escapeHTML(row.Venue);
      const details = escapeHTML(row.Details);
      const delay = Math.min(itemIndex * 42, 330);
      const year = String(row.Year || "Undated");
      const previousYear = itemIndex ? String(filtered[itemIndex - 1].Year || "Undated") : null;
      const nextYear = itemIndex < filtered.length - 1 ? String(filtered[itemIndex + 1].Year || "Undated") : null;
      const showYear = itemIndex === 0 || year !== previousYear;
      const dividerClass = nextYear === year ? " same-year-divider" : " year-end-divider";
      return `
        <article class="publication-flat-row${dividerClass}" style="--delay:${delay}ms">
          <div class="publication-flat-year">${showYear ? escapeHTML(year) : ""}</div>
          <div class="publication-type">${escapeHTML(row.Type_str || row.Type)}</div>
          <div class="publication-copy">
            <h2 class="publication-title">${escapeHTML(row.Title)}</h2>
            <div class="publication-authors">${escapeHTML(row.Authors)}</div>
            <div class="publication-venue">${venue ? `<em>${venue}</em>` : ""}${venue && details ? " · " : ""}${details}</div>
          </div>
          <div class="publication-action">${href ? `<a href="${escapeHTML(href)}" target="_blank" rel="noopener">Open</a>` : ""}</div>
        </article>`;
    }).join("");

    finishTransition();
  }

  function scheduleRender(){
    window.clearTimeout(updateTimer);
    startTransition();
    updateTimer = window.setTimeout(render, 155);
  }

  filters.forEach(box => box.addEventListener("change", scheduleRender));

  selectAll?.addEventListener("click", () => {
    filters.forEach(box => box.checked = true);
    scheduleRender();
  });

  clear?.addEventListener("click", () => {
    filters.forEach(box => box.checked = false);
    scheduleRender();
  });

  async function load(){
    try{
      if (typeof XLSX === "undefined") throw new Error("Spreadsheet reader did not load.");
      const response = await fetch(DATA_URL, {cache:"no-store"});
      if (!response.ok) throw new Error(`Could not load ${DATA_URL} (${response.status}).`);
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, {type:"array"});
      const sheet = workbook.Sheets[SHEET_NAME];
      if (!sheet) throw new Error(`Worksheet “${SHEET_NAME}” was not found.`);

      records = XLSX.utils.sheet_to_json(sheet, {defval:""}).map((row, index) => ({...row, __order:index}));
      render();
    }catch(error){
      console.error(error);
      count.textContent = "Unable to load";
      results.setAttribute("aria-busy", "false");
      results.innerHTML = `
        <div class="publication-error">
          <strong>The publication spreadsheet could not be loaded.</strong>
          Confirm that <code>${DATA_URL}</code> exists and that the site is being viewed through GitHub Pages or a local web server rather than directly as a <code>file://</code> page.
        </div>`;
    }
  }

  load();
})();
