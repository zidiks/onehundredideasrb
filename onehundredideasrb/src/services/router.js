const pages = require('../modules').pages;
const routeroutlet = document.getElementsByTagName('routeroutlet')[0];

const listener = (e) => {
    this.routeTo(e.target.getAttribute('to'));
}

const initRoutes = () => {
    Array.from(document.querySelectorAll('z-link')).forEach(element => {
        element.addEventListener('click', listener)
    });
}

exports.routeTo = (route) => {
    routeroutlet.style.opacity = 0;
    setTimeout(() => {
        if (pages[route] != undefined) swapHTML(pages[route]);
        else throw `Page "${route}" is not found!`;
        initRoutes();
        setTimeout(() => {
            routeroutlet.style.opacity = 1;
        }, 250);
    }, 200);
}

const swapHTML = (tmpl) => {
    routeroutlet.innerHTML = tmpl.template;
    tmpl.oninit();
}

this.routeTo('interfaceMode');