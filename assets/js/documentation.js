/* from control-toolbox.org/docs/pkg-name/stable/ */
function topbarInjector() {

    /* top bar menu */
    var navElement = document.createElement('nav');
    navElement.id = "multi-page-nav";
    navElement.className = "show-top-menu smooth-show-hide";
    navElement.innerHTML = `
        <a class="brand" href="https://control-toolbox.org/"><img alt="home" src="https://control-toolbox.org/assets/img/ct-logo-white.svg"></a>
        <div class="hidden-on-mobile" id="nav-items" style="width: inherit;">
        <a class="nav-link nav-item" href="https://control-toolbox.org/OptimalControl.jl">Documentation</a>
        <a class="nav-link nav-item" href="https://control-toolbox.org/Tutorials.jl">Tutorials</a>
        <div class="nav-dropdown">
            <button class="nav-item dropdown-label ">Applications</button>
            <ul class="nav-dropdown-container">
            <a class="nav-link nav-item" href="https://control-toolbox.org/CalculusOfVariations.jl">Calculus of variations</a>
            <a class="nav-link nav-item" href="https://agustinyabo.github.io/PWLdynamics.jl">Gene regulatory networks</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/GeometricPreconditioner.jl">Geometric preconditioner</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/LossControl.jl">Loss control</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/MagneticResonanceImaging.jl">Magnetic Resonance Imaging</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/Kepler.jl">Orbit transfer - Kepler</a>
            <a class="nav-link nav-item" href="https://anasxbouali.github.io/SIRcontrol.jl">SIR control</a>            
            </ul>
        </div>
        <a class="nav-link nav-item" href="https://control-toolbox.org/OptimalControlProblems.jl">Problems</a>
        <div class="nav-dropdown">
            <button class="nav-item dropdown-label ">Citing</button>
            <ul class="nav-dropdown-container">
            <a class="nav-link nav-item" href="https://control-toolbox.org/OptimalControl.jl/stable/#Citing-us">OptimalControl</a>
            <a class="nav-link nav-item" href="https://control-toolbox.org/OptimalControlProblems.jl/stable/#Citing-us">OptimalControlProblems</a>      
            </ul>
        </div>
        <a class="nav-link nav-item" href="https://github.com/control-toolbox">Github</a>
        </div>
        <button id="multidoc-toggler">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path>
        </svg>
        </button>`;

    var elt = document.getElementById("documenter");
    elt.insertBefore(navElement, elt.firstChild);

    // get class docs-sidebar if exists and add in the classes: show-top-menu and smooth-show-hide
    var sidebar = document.getElementsByClassName("docs-sidebar");
    if (sidebar.length > 0) {
        sidebar[0].classList.add("show-top-menu");
        sidebar[0].classList.add("smooth-show-hide");
    }

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

// Function to show the top bar menu
function showTopBar() {

    // update top bar
    var topbar = document.getElementById("multi-page-nav");
    if (topbar) {
        topbar.classList.remove("hide-top-menu");
        topbar.classList.add("show-top-menu");
    }

    // update sidebar
    var sidebar = document.getElementsByClassName("docs-sidebar");
    if (sidebar.length > 0) {
        sidebar[0].classList.remove("hide-top-menu");
        sidebar[0].classList.add("show-top-menu");
    }

}

// Function to hide the top bar menu
function hideTopBar() {

    // update top bar
    var topbar = document.getElementById("multi-page-nav");
    if (topbar) {
        topbar.classList.remove("show-top-menu");
        topbar.classList.add("hide-top-menu");
    }

    // update sidebar
    var sidebar = document.getElementsByClassName("docs-sidebar");
    if (sidebar.length > 0) {
        sidebar[0].classList.remove("show-top-menu");
        sidebar[0].classList.add("hide-top-menu");
    }

}

// ajoute un event listener sur les touches du clavier
function addEventListenerToShowHideTopbar() {

    // Ajout d'un écouteur d'événements pour la touche 's'
    document.addEventListener('keydown', function(event) {
        if (event.key === 's') {
            showTopBar();
            return false;
        }
    });

    // Ajout d'un écouteur d'événements pour la touche 'h'
    document.addEventListener('keydown', function(event) {
        if (event.key === 'h') {
            hideTopBar();
            return false;
        }
    });
}

// SIDEBAR TOGGLE
function addSidebarToggleButton() {

    // Select the element with the class "docs-right"
    var docsRight = document.querySelector('.docs-right');

    // Check if the element exists
    if (docsRight) {

        var buttonSidebar = document.getElementById('documenter-sidebar-button');
        if (buttonSidebar) {
            buttonSidebar.addEventListener('click', toggleSidebarButton);
        }
        
        var buttonStatus = localStorage.getItem('sidebarButtonStatus');
        if (buttonStatus === 'show') {
            showSidebar()
        } else {
            hideSidebar()
        }

    }
}

function toggleSidebarButton() {

    var buttonStatus = localStorage.getItem('sidebarButtonStatus');
    if (buttonStatus === 'show') {
        hideSidebar()
        localStorage.setItem('sidebarButtonStatus', 'hide');
    } else {
        showSidebar()
        localStorage.setItem('sidebarButtonStatus', 'show');
    }
    
}

function hideSidebar() {

    var sidebar = document.querySelector('.docs-sidebar');
    if (sidebar) {
        sidebar.classList.add('hidden')
    }

    var content = document.querySelector('.docs-main');
    if (content){
        content.classList.add('sidebar-hidden')
    }

}

function showSidebar() {

    var sidebar = document.querySelector('.docs-sidebar');
    if (sidebar) {
        sidebar.classList.remove('hidden')
    }

    var content = document.querySelector('.docs-main');
    if (content){
        content.classList.remove('sidebar-hidden')
    }

}

//
if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
) {
    // call on next available tick
    setTimeout(topbarInjector, 1);
    setTimeout(addEventListenerToShowHideTopbar, 1);
    setTimeout(addSidebarToggleButton, 1);
} else {
    document.addEventListener("DOMContentLoaded", topbarInjector);
    document.addEventListener("DOMContentLoaded", addEventListenerToShowHideTopbar);
    document.addEventListener("DOMContentLoaded", addSidebarToggleButton);
}

//
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
    footer.className = 'ct-footer';
    fetch('https://raw.githubusercontent.com/control-toolbox/control-toolbox.github.io/main/_includes/footer.html')
    .then(response => response.text())
    .then(text => footer.innerHTML = text);

    var docs_main = document.getElementsByClassName("docs-main");
    if (docs_main.length > 0) {
        docs_main[0].appendChild(footer);
    } else {
        document.body.appendChild(footer);
    }

};
