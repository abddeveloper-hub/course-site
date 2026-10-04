// NEXVION AI ACADEMY - Executive Navbar Controller
const ExecutiveNavbar = {
  init: function () {
    // Scrolled header backdrop shadow effect
    window.addEventListener("scroll", () => {
      const nav = document.querySelector(".exec-navbar, .navbar");
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    }, { passive: true });
  }
};

document.addEventListener("DOMContentLoaded", () => ExecutiveNavbar.init());
if (document.readyState === "complete" || document.readyState === "interactive") {
  ExecutiveNavbar.init();
}
