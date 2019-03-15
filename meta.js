const META = {};
const SUBSCRIBERS = {};


function getMeta(ns, key, _default=undefined) {
    let scope = META[ns] || {};
    let meta = (key in scope) ? scope[key] : _default;
    return meta;
}

function setMeta(ns, key, meta) {
    let scope = META[ns] = META[ns] || {};
    (META[ns] = scope)[key] = meta;
    // notify subscribers
    ((SUBSCRIBERS[ns] || {})[key] || []).forEach(handler => handler(meta));
}

function subscribeMeta(ns, key, handler) {
    const scope = SUBSCRIBERS[ns] = SUBSCRIBERS[ns] || {};
    const handlers = scope[key] = scope[key] || [];
    handlers.push(handler);
}

function unsubscribeMeta(ns, key, handler) {
    const scope = SUBSCRIBERS[ns] || {};
    if (scope[key]) {
        scope[key] = scope[key].filter(h => h !== handler);
    }
}




function renderMarkup(markup, root) {
    const template = document.createElement('template');
    template.innerHTML = markup;
    while (root.hasChildNodes()) root.removeChild(root.childNodes[0]);
    root.appendChild(root.ownerDocument.importNode(template.content, true));
}




function html(strings, ...params) {
    const template = document.createElement('template');
    template.innerHTML = params.reduce((markup, param, index) => markup + String(param) + strings[index+1], strings[0]);
    return template;
}

function render(template, root) {
    const clone = root.ownerDocument.importNode(template.content, true);
    while (root.hasChildNodes()) root.removeChild(root.childNodes[0]);
    root.appendChild(clone);
}

export { render, html, renderMarkup, setMeta, getMeta, subscribeMeta, unsubscribeMeta }
