import { render } from 'https://unpkg.com/lit-html?module';
import { getMeta } from './meta.js';


class XIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.icon = this.getAttribute('icon');
        this._size = this.getAttribute('size');



        this._updateIcon();
    }

    static get observedAttributes() { return ['icon', 'size']; }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this._updateIcon();
    }

    _updateIcon() {
        let icon = this.icon;
        if (!icon) {
            console.warn(`Clear icon when no icon given not implemented`);
//            return;
        }

        [this.setName, this.iconName] = icon.split(':', 2);
        if (this.iconName === undefined) [this.setName, this.iconName] = ['default-iconset', this.setName];

        this.iconSet = getMeta('icons-iconset', this.setName);

        (this.iconSet ? customElements.whenDefined(this.iconSet.localName) : Promise.reject(`Iconset "${this.setName}" not found.`))
            .then(_ => {
                render(this.iconSet.buildIconTemplate(this), this.shadowRoot);
            }, err => {
                render(html``, this.shadowRoot);
                console.error(`Invalid attribute: icon="${icon}".`, err, this);
            })
            ;
    }

}

customElements.define('x-icon', XIcon);


export { XIcon }
