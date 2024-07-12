/* from control-toolbox.org/docs/pkg-name/stable/ */
function topbarInjector() {

    /* top bar menu */
    var navElement = document.createElement('nav');
    navElement.id = "multi-page-nav";
    navElement.innerHTML = `
        <a class="brand" href="https://control-toolbox.org/"><img alt="home" src="https://control-toolbox.org/assets/img/ct-logo-white.svg"></a>
        <div class="hidden-on-mobile" id="nav-items" style="width: inherit;">
        <a class="nav-link nav-item" href="https://control-toolbox.org/OptimalControl.jl/stable">OptimalControl</a>
        <a class="nav-link nav-item" href="https://control-toolbox.org/CTProblems.jl/stable">CTProblems</a>
        <div class="nav-dropdown">
            <button class="nav-item dropdown-label ">Applications</button>
            <ul class="nav-dropdown-container">
            <a class="nav-link nav-item" href="https://control-toolbox.org/mri/stable/">MRI</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/kepler/stable/">Kepler</a>
            </ul>
        </div>
        </div>
        <button id="multidoc-toggler">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path>
        </svg>
        </button>`;

    var body = document.body;
    body.insertBefore(navElement, body.firstChild);

    // 
    document
        .getElementById("multidoc-toggler")
        .addEventListener("click", function () {
        document.getElementById("nav-items").classList.toggle("hidden-on-mobile");
        });

    // 
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

    /* footer */
    var footer = document.createElement('footer');
    fetch('https://raw.githubusercontent.com/control-toolbox/control-toolbox.github.io/main/_includes/footer.html')
    .then(response => response.text())
    .then(text => footer.innerHTML = text);
    document.body.appendChild(footer);

};

