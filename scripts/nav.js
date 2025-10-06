// Add subtle navbar scroll shrink
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 60) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});
