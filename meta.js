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

export { setMeta, getMeta, subscribeMeta, unsubscribeMeta }
