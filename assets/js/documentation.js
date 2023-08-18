/* from control-toolbox.org/docs/pkg-name/stable/ */

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
    /*
    fetch('https://control-toolbox.org/_includes/footer.html')
    .then(response => response.text())
    .then(text => $(footer).innerHTML = text);
    */
    footer.innerHTML = "<p>© 2023 control-toolbox</p>"
    document.body.appendChild(footer);

    var f = document.createElement("FOOTER");
    document.body.appendChild(f);
    var p = document.createElement("P");
    var txt = document.createTextNode("Copyright ©, 2019");
    p.appendChild(txt);
    f.appendChild(p);

};