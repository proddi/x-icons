console.warn("~ meta storage initialized");

const STORAGE = {};


function getMeta(ns, key, _default=undefined) {
    let scope = STORAGE[ns] || {};
    let meta = (key in scope) ? scope[key] : _default;
    return meta;
}

function setMeta(ns, key, meta, override=false) {
    let scope = STORAGE[ns] = STORAGE[ns] || {};
    if (!override && key in scope) {
        throw Error(`Meta key "${key}" already registered`);
    }
    (STORAGE[ns] = scope)[key] = meta;
}


export { setMeta, getMeta }
