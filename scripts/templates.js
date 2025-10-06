// Templates Page JavaScript - Pink & Black Theme

function selectTemplate(template) {
    // Store selected template and navigate to builder
    localStorage.setItem('selectedTemplate', template);
    window.location.href = 'builder.html';
}

// Add subtle navbar scroll shrink
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".sonoaac-header");
    if (window.scrollY > 60) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
});