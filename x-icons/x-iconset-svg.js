import { html, render } from 'https://unpkg.com/lit-html?module';
import { setMeta } from './meta.js';


class XIconsetSvg extends HTMLElement {
    constructor() {
        super();
        if (!this.hasAttribute('name')) this.setAttribute('name', 'default-iconset');
        this._name = this.getAttribute('name');
        this._href = this.getAttribute('href');
        // the pixel size of the icons in this icon set
        this._size = this.getAttribute('size') || '1em';

        let iconSize = this.getAttribute('icon-size');
        if (!iconSize) {
            iconSize = "24";
            console.warn(`Iconset "${this._name}" doesn't have an "icon-size" attribute. Using default ${iconSize} pixels.`);
        }

        [this._iconWidth, this._iconHeight] = iconSize.split(/[,x]/);
        if (!this._iconHeight) this._iconHeight = this._iconWidth;
        [this._iconWidth, this._iconHeight] = [parseInt(this._iconWidth), parseInt(this._iconHeight)];
        this._iconRatio = this._iconHeight / this._iconWidth;


        setMeta('icons-iconset', this._name, this);

        this.attachShadow({mode: 'open'});
        render(this.render(), this.shadowRoot);

        // attach extended svgs
        this._innerIcons = {};
        this.shadowRoot.querySelector('slot')
            .assignedElements()
            .map(el => Array.from(el.querySelectorAll('[id]'))
                        .map(node => [node.getAttribute('id'), node.outerHTML])
            )
            .reduce((p, c) => p.concat(c), [])
            .forEach(([name, markup]) => this._innerIcons[name] = markup)
            ;

    }

    async getIconNames() {
        return fetch(this._href)
            .then(response => response.text())
            .then(markup => new DOMParser().parseFromString(markup, "image/svg+xml"))
            .then(doc => doc.querySelectorAll('[id]'))
            .then(nodes => Array.from(nodes).map(node => node.getAttribute('id')))
            ;
    }

    render() {
        return html`
            <style>
                :host {
                    display: none;
                }
            </style>
            <slot></slot>
        `
    }

    buildIconTemplate(icon) {
        return html`
            <style>
                :host {
                    width: calc(${icon._size || this._size});
                    display: inline-block;
                    vertical-align: text-bottom;
                }
                svg {
                    width: 100%;
                    vertical-align: middle;
                }
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this._iconWidth} ${this._iconHeight}" style="fill:currentColor;">
                <use href="${this._innerIcons[icon.iconName] ? '' : this._href}#${icon.iconName}"/>
            </svg>
        `
    }
}

customElements.define('x-iconset-svg', XIconsetSvg);


export { XIconsetSvg }
