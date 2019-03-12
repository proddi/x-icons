import { render, html } from 'lit-html/lit-html.js';
import { getMeta } from './meta.js';

/**

The `x-icon` element displays an icon. The size is defined in the icon-set and by default 1em.

Example using src:

    <x-icon src="star.png"></x-icon>

Example setting size to 32px x 32px:

    <x-icon style="width:32px" src="big_star.png"></x-icon>

See `<x-iconset-svg>` and `<x-iconset-img>` for more information about how to create a custom iconset.

@group X Elements
@element x-icon
@demo demo/index.html
@hero hero.svg
@homepage https://github.com/proddi/x-icons
*/
class XIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        /**
         * The name of the icon to use. The name should be of the form: `iconset_name:icon_name`.
         * @type {String}
         */
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
