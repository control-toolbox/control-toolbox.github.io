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

}

// Function to hide the top bar menu
function hideTopBar() {

    // update top bar
    var topbar = document.getElementById("multi-page-nav");
    if (topbar) {
        topbar.classList.remove("show-top-menu");
        topbar.classList.add("hide-top-menu");
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
    setTimeout(addScrollTopBehavior, 1);
} else {
    document.addEventListener("DOMContentLoaded", topbarInjector);
    document.addEventListener("DOMContentLoaded", addEventListenerToShowHideTopbar);
    document.addEventListener("DOMContentLoaded", addSidebarToggleButton);
    document.addEventListener("DOMContentLoaded", addScrollTopBehavior);
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

// Ensure focus returns to main content after sidebar toggle to keep scroll behavior responsive
function addFocusRestoreAfterSidebarToggle() {
    function getMainContent() {
        return (
            document.getElementById('documenter-page') ||
            document.querySelector('#documenter .docs-main article.content') ||
            document.querySelector('#documenter article.content') ||
            document.querySelector('article.content')
        );
    }

    function ensureMainTabindex() {
        var main = getMainContent();
        if (main && !main.hasAttribute('tabindex')) {
            main.setAttribute('tabindex', '-1');
        }
        return main;
    }

    function focusMainContent() {
        var main = ensureMainTabindex();
        if (main) {
            try { main.focus({ preventScroll: true }); } catch (e) { try { main.focus(); } catch (e2) {} }
        } else {
            try { window.focus(); } catch (e) {}
        }
    }

    function blurSidebarToggle() {
        var btn = document.getElementById('documenter-sidebar-button');
        if (btn && typeof btn.blur === 'function') {
            try { btn.blur(); } catch (e) {}
        }
    }

    function onToggleAttempt(e) {
        var el = e.target;
        if (!el) return;
        var isToggle = (el.id === 'documenter-sidebar-button') || (el.closest && el.closest('#documenter-sidebar-button'));
        if (!isToggle) return;
        // Immediately blur the toggle to release focus
        blurSidebarToggle();
        // Restore focus to main content (twice to survive async class toggles)
        setTimeout(focusMainContent, 0);
        setTimeout(focusMainContent, 60);
    }

    // Listeners on multiple interaction types for robustness
    document.addEventListener('mousedown', onToggleAttempt, true);
    document.addEventListener('touchstart', onToggleAttempt, { passive: true, capture: true });
    document.addEventListener('click', onToggleAttempt, true);

    // Ensure tabindex exists early
    ensureMainTabindex();
}

// Initialize focus restore as soon as possible
try {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addFocusRestoreAfterSidebarToggle();
    } else {
        document.addEventListener('DOMContentLoaded', addFocusRestoreAfterSidebarToggle);
    }
} catch (e) { /* no-op */ }

// Add scroll behavior to hide topbar when scrolled down beyond a threshold
function addScrollTopBehavior() {
    var ticking = false;
    var threshold = 20; // px tolerance; adjustable (top and bottom)

    // Cache last states to avoid redundant DOM writes
    var lastTopbarVisible = null;
    var lastHeaderVisible = null;
    var lastScrollY = window.scrollY || window.pageYOffset || 0;
    // Accumulated scroll thresholds (px)
    var UP_THRESHOLD = 14;
    var DOWN_THRESHOLD = 20;
    var accum = 0;       // accumulated dy in the current direction
    var dirSign = 0;     // 1 for up, -1 for down, 0 for none
    var lastVisible = null; // persistent desired visibility state

    function isTopbarMenuOpen() {
        var navItems = document.getElementById("nav-items");
        if (!navItems) return false;
        // On mobile, nav is open when it does NOT have 'hidden-on-mobile'
        return !navItems.classList.contains("hidden-on-mobile");
    }

    function isDocSidebarVisible() {
        // Prefer layout state from .docs-main
        var main = document.querySelector('.docs-main');
        if (main && main.classList.contains('sidebar-hidden')) {
            return false;
        }
        var sidebar = document.querySelector('.docs-sidebar');
        if (!sidebar) return false;
        // If both 'hidden' and 'visible' are present, treat as hidden
        if (sidebar.classList.contains('hidden')) return false;
        return sidebar.classList.contains('visible');
    }

    function getHeaderEl() {
        return document.querySelector('#documenter .docs-main header.docs-navbar');
    }

    function atTopOrBottom(tol) {
        var y = window.scrollY || window.pageYOffset || 0;
        var atTop = y <= tol;
        var atBottom = (window.innerHeight + y) >= ((document.documentElement && document.documentElement.scrollHeight) || document.body.offsetHeight) - tol;
        return { atTop: atTop, atBottom: atBottom, y: y };
    }

    function setHeaderVisible(visible) {
        var header = getHeaderEl();
        if (!header) return;
        if (visible === lastHeaderVisible) return;
        header.classList.toggle('ct-header-visible', !!visible);
        header.classList.toggle('ct-header-hidden', !visible);
        lastHeaderVisible = visible;
    }

    function setTopbarVisible(visible) {
        if (visible === lastTopbarVisible) return;
        if (visible) {
            showTopBar();
        } else {
            hideTopBar();
        }
        lastTopbarVisible = visible;
    }

    function computeDesiredVisibility() {
        var pos = atTopOrBottom(threshold);
        var dy = lastScrollY - pos.y; // positive when scrolling up

        // If menus are open, always visible
        if (isTopbarMenuOpen() || isDocSidebarVisible()) {
            // reset accumulation so we don't surprise after closing
            accum = 0; dirSign = 0;
            return { visible: true, atBottom: false, atTop: pos.atTop, y: pos.y };
        }

        // At top or bottom within threshold => visible
        if (pos.atTop || pos.atBottom) {
            accum = 0; dirSign = 0;
            return { visible: true, atBottom: pos.atBottom, atTop: pos.atTop, y: pos.y };
        }

        // Mid-page: accumulate movement until threshold reached
        var sign = dy > 0 ? 1 : (dy < 0 ? -1 : 0);
        if (sign === 0) {
            // no movement: keep state, do not change accum
            return { visible: (lastVisible !== null ? lastVisible : false), atBottom: false, atTop: false, y: pos.y };
        }
        if (sign !== dirSign) {
            // direction changed: reset accumulator to current delta
            accum = dy;
            dirSign = sign;
        } else {
            accum += dy;
        }

        if (dirSign === 1 && accum >= UP_THRESHOLD) {
            // show after sufficient upward scroll
            return { visible: true, atBottom: false, atTop: false, y: pos.y };
        }
        if (dirSign === -1 && (-accum) >= DOWN_THRESHOLD) {
            // hide after sufficient downward scroll
            return { visible: false, atBottom: false, atTop: false, y: pos.y };
        }

        // Not enough movement yet: keep previous
        return { visible: (lastVisible !== null ? lastVisible : false), atBottom: false, atTop: false, y: pos.y };
    }

    function update() {
        ticking = false;
        var res = computeDesiredVisibility();
        var visible = res.visible;
        // Toggle a root class to signal that appearance originates from bottom
        // Only set when not forced by menus
        var fromBottom = res.atBottom && !(isTopbarMenuOpen() || isDocSidebarVisible());
        try {
            document.documentElement.classList.toggle('ct-appear-bottom', !!fromBottom);
        } catch (e) { /* no-op */ }
        setTopbarVisible(visible);
        setHeaderVisible(visible);
        // update last scroll position after applying visibility
        lastScrollY = res.y;
        lastVisible = visible;
    }

    // Initial state: compute once based on current position
    update();

    // Scroll listener
    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    // Resize listener (in case layout switches around 1055px)
    window.addEventListener('resize', function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    });

    // Click on Documenter burger button: force reevaluation
    var docBurger = document.getElementById('documenter-sidebar-button');
    if (docBurger) {
        docBurger.addEventListener('click', function () {
            // Wait a tick so classes update
            setTimeout(update, 0);
        });
    }

    // Observe sidebar visibility class changes
    var sidebar = document.querySelector('.docs-sidebar');
    if (sidebar && 'MutationObserver' in window) {
        try {
            var observer = new MutationObserver(function () {
                update();
            });
            observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
        } catch (e) {
            // no-op
        }
    }
}
