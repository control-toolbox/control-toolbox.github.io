/* from control-toolbox.org/docs/pkg-name/stable/ */

window.onload = function() {

    /* topbar javascript */
    var script = document.createElement("script");
    script.src = 'https://control-toolbox.org/assets/js/topbar.js';
    document.head.appendChild(script); 

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

    /* footer */
    var footer = document.createElement('footer');
    fetch('https://raw.githubusercontent.com/control-toolbox/control-toolbox.github.io/main/_includes/footer.html')
    .then(response => response.text())
    .then(text => footer.innerHTML = text);
    document.body.appendChild(footer);

};