import { html, render } from 'lit-html/lit-html.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { setMeta } from './meta.js';


/**

The `x-iconset-svg` element allows users to define their own icon sets that contain svg icons.


@group X Elements
@element x-iconset-svg
@demo demo/index.html
@homepage https://github.com/proddi/x-icons
*/
class XIconsetSvg extends HTMLElement {
    constructor() {
        super();
        if (!this.hasAttribute('name')) this.setAttribute('name', 'default-iconset');
        this._name = this.getAttribute('name');
        this._href = this.getAttribute('href');
        // the pixel size of the icons in this icon set
        this._size = this.getAttribute('size') || '1em';

        /**
         * The scale gets multiplied with the icon's size. (default=1)
         * @type {Float}
         */
        this.scale = this.getAttribute('scale') || '1';

        let iconSize = this.getAttribute('icon-size');
        if (!iconSize) {
            iconSize = "24";
            console.warn(`Iconset "${this._name}" doesn't have an "icon-size" attribute. Using default ${iconSize} pixels.`);
        }

        [this._iconWidth, this._iconHeight] = iconSize.split(/[,x]/);
        if (!this._iconHeight) this._iconHeight = this._iconWidth;
        [this._iconWidth, this._iconHeight] = [parseInt(this._iconWidth), parseInt(this._iconHeight)];
        this._iconRatio = this._iconHeight / this._iconWidth;

        // render
        this.attachShadow({mode: 'open'});
        render(this.render(), this.shadowRoot);

        // attach additional slot svgs
        this._innerIcons = {};
        this.shadowRoot.querySelector('slot')
            .assignedElements()
            .map(el => Array.from(el.querySelectorAll('[id]'))
                        .map(node => [node.getAttribute('id'), node, node.outerHTML])
            )
            .reduce((p, c) => p.concat(c), [])
            .forEach(([name, node, markup]) => this._innerIcons[name] = [node, markup])
            ;

        // register iconset
        setMeta('icons-iconset', this._name, this);
    }

    static get observedAttributes() { return ['scale', 'href']; }

    attributeChangedCallback(name, _, value) {
        switch(name) {
            case 'scale':
                this._scaleChanged(value);
                break;
            case 'href':
                this._hrefChanged(value)
                break;
        }
    }

    _scaleChanged(scale) {
        if (scale !== this.scale) {
            this.scale = scale;
            setMeta('icons-iconset', this._name, this);
        }
    }

    _hrefChanged(src) {
        if (src !== this._src) {
            this._href = src;
            setMeta('icons-iconset', this._name, this);
        }
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

    applyIcon(root, icon) {
        render(this.buildIconTemplate(icon.iconName, icon.size), root);
        // TODO: individual rendering?
        const inlineIcon = this._innerIcons[icon.iconName];
        if (inlineIcon) {
            root.querySelector('svg').appendChild(inlineIcon[0].cloneNode(true));
        }
    }

    buildIconTemplate(iconName, iconSize) {
        return html`
            <style>
                :host {
                    width: calc(${iconSize || this._size} * ${this.scale});
                    display: inline-block;
                    vertical-align: middle;
                }
                svg {
                    width: 100%;
                }
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this._iconWidth} ${this._iconHeight}" style="fill:currentColor;">
                <use href="${this._innerIcons[iconName] ? '' : this._href}#${iconName}"/>
            </svg>
        `
    }
}

customElements.define('x-iconset-svg', XIconsetSvg);


export { XIconsetSvg }
