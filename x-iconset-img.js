import { html, render } from 'lit-html/lit-html.js';
import { setMeta } from './meta.js';


/**

The `x-iconset-img` element allows users to define their own icon sets that contain sprite-map icons.


@group X Elements
@element x-iconset-img
@demo demo/index.html
@homepage https://github.com/proddi/x-icons
*/
class XIconsetImg extends HTMLElement {
    constructor() {
        super();
//        if (!this.hasAttribute('name')) this.setAttribute('name', 'default-iconset');
        this._name = this.getAttribute('name');
        this._src = this.getAttribute('src');
        this._size = this.getAttribute('size') || '1em';
        this._width = this.getAttribute('width');
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

    async getIconNames() {
        return Promise.resolve(this._icons);
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
                    width: calc(${iconSize || this._size});
                    height: calc(${iconSize || this._size} * ${this._iconRatio});
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
                }
            </style>
            <i></i>
        `
    }
}

customElements.define('x-iconset-img', XIconsetImg);


export { XIconsetImg }
