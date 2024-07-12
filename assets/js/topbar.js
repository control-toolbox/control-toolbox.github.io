function topbarInjector() {
    document.body.addEventListener("click", function (ev) {
      const thisIsExpanded = ev.target.matches(".nav-expanded > .dropdown-label");
      if (!ev.target.matches(".nav-dropdown-container")) {
        Array.prototype.forEach.call(
          document.getElementsByClassName("dropdown-label"),
          function (el) {
            el.parentElement.classList.remove("nav-expanded");
          }
        );
      }
      if (!thisIsExpanded && ev.target.matches(".dropdown-label")) {
        ev.target.parentElement.classList.add("nav-expanded");
      }
    });
  }
  
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(topbarInjector, 1);
  } else {
    document.addEventListener("DOMContentLoaded", topbarInjector);
  }
  