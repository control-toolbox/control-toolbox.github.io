/* from control-toolbox.org/docs/pkg-name/stable/ */
function topbarInjector() {

    document
      .getElementById("multidoc-toggler")
      .addEventListener("click", function () {
        document.getElementById("nav-items").classList.toggle("hidden-on-mobile");
      });
  
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

window.onload = function() {

    /* google analytics */
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J27VDFHJW2');

    /* ct favicon */
    var favicon = document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'icon';
    favicon.href = 'https://control-toolbox.org/assets/img/ct-logo.svg';
    document.head.appendChild(favicon);

    /* top bar menu */
    var topbar = document.createElement('div');
    fetch('https://raw.githubusercontent.com/control-toolbox/control-toolbox.github.io/main/_includes/navigation.html')
    .then(response => response.text())
    .then(text => topbar.innerHTML = text);
    document.body.insertBefore(topbar, document.body.firstChild);

    /* top bar javascript */
    // var script = document.createElement("script");
    // script.src = 'https://control-toolbox.org/assets/js/topbar.js';
    // document.head.appendChild(script);
    document.addEventListener("DOMContentLoaded", topbarInjector);

    /* footer */
    var footer = document.createElement('footer');
    fetch('https://raw.githubusercontent.com/control-toolbox/control-toolbox.github.io/main/_includes/footer.html')
    .then(response => response.text())
    .then(text => footer.innerHTML = text);
    document.body.appendChild(footer);

};