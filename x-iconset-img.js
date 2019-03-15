import { render, html, setMeta } from './meta.js';

/**
 *
 * The `x-iconset-img` element allows users to define their own icon sets that contain sprite-map icons.
 *
 *
 * @group X Elements
 * @element x-iconset-img
 * @demo demo/index.html
 * @homepage https://github.com/proddi/x-icons
**/
class XIconsetImg extends HTMLElement {
    constructor() {
        super();
        this._name = this.getAttribute('name');
        this._src = this.getAttribute('src');
        this._size = this.getAttribute('size') || '1em';
        this._width = this.getAttribute('width');

        /**
         * The scale gets multiplied with the icon's size. (default=1)
         * @type {Float}
         */
        this.scale = '1';
        this._icons = this.getAttribute('icons').split(/[ ,]/);
        let iconSize = this.getAttribute('icon-size');
        if (!iconSize) {
            iconSize = "24";
            console.warn(`Iconset "${this._name}" doesn't have an "icon-size" attribute. Using default ${iconSize} pixels.`);
        }

        [this._iconWidth, this._iconHeight] = iconSize.split(/[,x]/);
        if (!this._iconHeight) this._iconHeight = this._iconWidth;
        [this._iconWidth, this._iconHeight] = [parseInt(this._iconWidth), parseInt(this._iconHeight)];
        this._iconRatio = this._iconHeight / this._iconWidth;

        this._iconsPerRow = this._width / this._iconWidth;

        setMeta('icons-iconset', this._name, this);
    }

    static get observedAttributes() { return ['scale', 'src']; }

    attributeChangedCallback(name, _, value) {
        switch(name) {
            case 'scale':
                this._scaleChanged(value);
                break;
            case 'src':
                this._srcChanged(value)
                break;
        }
    }

    _scaleChanged(scale) {
        if (scale !== this.scale) {
            this.scale = scale;
            setMeta('icons-iconset', this._name, this);
        }
    }

    _srcChanged(src) {
        if (src !== this._src) {
            this._src = src;
            setMeta('icons-iconset', this._name, this);
        }
    }

    get iconNames() {
        return this._icons;
    }

    applyIcon(root, icon) {
        render(this.buildIconTemplate(icon.iconName, icon.size), root);
    }

    buildIconTemplate(iconName, iconSize) {
        let index = this._icons.indexOf(iconName);
        let x = index % this._iconsPerRow;
        let y = Math.floor(index /this._iconsPerRow);
        return html`
            <style>
                :host {
                    display: inline-block;
                    width: ${iconSize || this._size};
                    height: calc(${iconSize || this._size} * ${this._iconRatio});
                    line-height: 1;
                    vertical-align: middle;
                }
                i {
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    background: url(${this._src});
                    background-size: calc(${iconSize || this._size} * ${this._iconsPerRow});
                    background-position: ${100 / (this._iconsPerRow-1) * x}% ${100 / (this._iconsPerRow-1) * y}%;
                    background-repeat: no-repeat;
                    ${this.scale ? `transform: scale(${this.scale});` : ''}
                }
            </style>
            <i></i>
        `
    }

}

customElements.define('x-iconset-img', XIconsetImg);


export { XIconsetImg }
