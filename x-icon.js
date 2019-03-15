import { getMeta, subscribeMeta, unsubscribeMeta } from './meta.js';

/**
 *
 * The `x-icon` element displays an icon. The size is defined in the icon-set and by default 1em.
 * Example setting size to 32px x 32px:
 *
 *     <x-icon size="32px" icon="iconset:name"></x-icon>
 *
 * See `<x-iconset-svg>` and `<x-iconset-img>` for more information about how to create a custom iconset.
 *
 * @group X Elements
 * @element x-icon
 * @demo demo/index.html
 * @homepage https://github.com/proddi/x-icons
**/
class XIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        /**
         * The name of the icon to use. The name should be of the form: `iconset_name:icon_name`.
         * @type {String}
         */
        this.icon = null;

        /**
         * The size of the icon. If not set it inherits from iconset.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length
         * @type {CSS/length}
         */
        this.size = null;


        this.iconName = null;
        this.iconSetName = null;

        // Handler getting called when attached iconset changed
        this._metaHandler = iconset => this._updateIcon();
    }

    static get observedAttributes() { return ['icon', 'size']; }

    attributeChangedCallback(name, _, value) {
        switch(name) {
            case 'icon':
                this._iconChanged(value)
                break;
            case 'size':
                this._sizeChanged(value)
                break;
        }
    }

    _iconChanged(icon) {
        if (icon !== this.icon) {
            unsubscribeMeta('icons-iconset', this.iconsetName, this._metaHandler)

            this.icon = icon;
            [this.iconsetName, this.iconName] = icon.split(':', 2);
            if (this.iconName === undefined) [this.iconsetName, this.iconName] = [undefined, this.iconsetName];

            this._updateIcon();
            subscribeMeta('icons-iconset', this.iconsetName, this._metaHandler)
        }
    }

    _sizeChanged(size) {
        if (size !== this.size) {
            this.size = size;
            this._updateIcon();
        }
    }

    _updateIcon() {
        const iconset = getMeta('icons-iconset', this.iconsetName);
        if (iconset) {
            iconset.applyIcon(this.shadowRoot, this)
        } else {
           while (this.shadowRoot.hasChildNodes()) {
              this.shadowRoot.removeChild(this.shadowRoot.firstChild);
           }
        }
    }

}

customElements.define('x-icon', XIcon);


export { XIcon }
