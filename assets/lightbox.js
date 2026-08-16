document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("image-lightbox");
  if (!box) return;
  const img = box.querySelector(".image-lightbox-img");
  const close = box.querySelector(".image-lightbox-close");
  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "Expanded figure";
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const shut = () => {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    img.removeAttribute("src");
  };
  document.querySelectorAll("a.lightbox-trigger").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const thumb = a.querySelector("img");
      open(a.getAttribute("href"), thumb ? thumb.alt : "Expanded figure");
    });
  });
  close.addEventListener("click", shut);
  box.addEventListener("click", e => { if (e.target === box) shut(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("is-open")) shut(); });
});
