/* control-toolbox.org — VitePress global navigation */
(function () {
    function inject() {
        if (document.getElementById('ct-banner')) return;
        var banner = document.createElement('nav');
        banner.id = 'ct-banner';
        banner.innerHTML =
            '<a class="ct-brand" href="https://control-toolbox.org/">' +
                '<img src="https://control-toolbox.org/assets/img/ct-logo-white.svg" alt="control-toolbox">' +
            '</a>' +
            '<div class="ct-links" id="ct-links">' +
                '<a href="https://control-toolbox.org/OptimalControl.jl">Documentation</a>' +
                '<a href="https://control-toolbox.org/Tutorials.jl">Tutorials</a>' +
                '<a href="https://control-toolbox.org/applications/">Applications</a>' +
                '<a href="https://control-toolbox.org/OptimalControlProblems.jl">Problems</a>' +
                '<a href="https://github.com/control-toolbox">GitHub</a>' +
                '<a href="https://control-toolbox.org/contributors/">Contributors</a>' +
            '</div>' +
            '<button id="ct-toggler" aria-label="Toggle navigation">' +
                '<span class="ct-hamburger-container">' +
                    '<span class="ct-hamburger-top"></span>' +
                    '<span class="ct-hamburger-middle"></span>' +
                    '<span class="ct-hamburger-bottom"></span>' +
                '</span>' +
            '</button>';
        var app = document.getElementById('app');
        if (app) app.parentNode.insertBefore(banner, app);

        document.getElementById('ct-toggler').addEventListener('click', function () {
            this.classList.toggle('ct-toggler-active');
            document.getElementById('ct-links').classList.toggle('ct-links-open');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
}());

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

    /* modify copyright text */
    var copyrightElement = document.querySelector('.VPFooter .copyright');
    if (copyrightElement) {
        copyrightElement.innerHTML = "© Copyright 2026 control-toolbox.";
    }

};