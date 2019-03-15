import { render, html, renderMarkup, setMeta } from './meta.js';

const DEFAULT_VIEWBOX = "0 0 24 24";

/**
 *
 * The `x-iconset-svg` element allows users to define their own icon sets that contain svg icons.
 *
 *
 * @group X Elements
 * @element x-iconset-svg
 * @demo demo/index.html
 * @homepage https://github.com/proddi/x-icons
**/
class XIconsetSvg extends HTMLElement {
    constructor() {
        super();
        this._name = this.getAttribute('name');
        this._href = this.getAttribute('href');

        /**
         * The size of an individual icon. Note that icons must be square.
         */
        if (this.hasAttribute('size')) console.warn(`<x-iconset-svg size=".."> is deprecated. Default size is 1em. If you need a specific size, use CSS.`, this);

        /**
         * The scale gets multiplied with the icon's size. (default=1)
         * @type {Float}
         */
        this.scale = this.getAttribute('scale') || '1';

        this.viewBox = this.getAttribute('viewBox');

        let iconSize = this.getAttribute('icon-size');
        if (iconSize) {
            let [iconWidth, iconHeight] = iconSize.split(/[,x]/);
            if (iconHeight === undefined) iconHeight = iconWidth;
            if (!this.viewBox) this.viewBox = `0 0 ${iconWidth} ${iconHeight}`;
        }

        /**
         * @type {string[]|null}
         */
        let icons = this.getAttribute('icons');
        if (icons === "FETCH") {
            this._getRemoteIcons().then(names => this._icons = names);
        }
        if (icons) {
            this._icons = icons.split(/[ ,]/);
        }

        this._aliases = {};
        let aliases = (this.getAttribute('aliases') || "")
                .split(/[ ,]/)
                .filter(alias => alias)
                .map(alias => alias.split('=').map(piece => piece.trim()))
                .forEach(([alias, name]) => this._aliases[alias] = name)
                ;

        // render
        this.attachShadow({mode: 'open'});
        render(this.render(), this.shadowRoot);

        // attach additional slot svgs
        this._inlineIcons = {};
        this.shadowRoot.querySelector('slot')
            .assignedElements()
            .filter(el => el instanceof SVGElement)
            .map(svg => Array.from(svg.querySelectorAll('[id]'))
                        .map(node => [
                            node.getAttribute('id'),
                            {
                                svg: svg,
                                viewBox: svg.getAttribute('viewBox'),
                                style: svg.getAttribute('style'),
                                node: node,
                                markup: node.outerHTML,
                            }
                        ])
            )
            .reduce((p, c) => p.concat(c), [])
            .forEach(([name, icon]) => this._inlineIcons[name] = icon)
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

    get iconNames() {
        return Object.keys(this._inlineIcons).concat(this._icons || []).concat(Object.keys(this._aliases));
    }

    /**
     * @experimental
     * @returns {Promise<String[]|Error>}
     */
    _getRemoteIcons() {
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
        renderMarkup(this.buildIconMarkup(icon), root);
    }

    buildIconMarkup(icon) {
        const styles = `
            <style>
                :host {
                    display: inline-block;
                    line-height: 1;
                    width: ${icon.size || "1em"};
                    /* height: ${icon.size || "1em"}; */
                    vertical-align: middle;
                    /* padding-bottom: 0.25em; */
                }
                svg {
                    width: 100%;
                    ${this.scale ? `transform: scale(${this.scale});` : ''}
                }
            </style>
        `;

        const iconName = this._findExistingIconName(icon.iconName);

        const inlineIcon = this._inlineIcons[iconName];
        const svgTemplate = inlineIcon ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="${inlineIcon.viewBox || DEFAULT_VIEWBOX}" style="fill:currentColor;${inlineIcon.style || ''}">
                    ${inlineIcon.markup}
                </svg>
            ` : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox || DEFAULT_VIEWBOX}" style="fill:currentColor;">
                    <use href="${this._href}#${iconName}"/>
                </svg>
            `;
        return styles + svgTemplate;
    }

    _findExistingIconName(fullName) {
        const names = fullName.split('||').map(name => name.trim());
        const existingNames = this.iconNames;
        const name = names.slice(0, -1).find(name => existingNames.indexOf(name) !== -1) || names.slice(-1)[0];
        return this._aliases[name] || name;
    }

}

customElements.define('x-iconset-svg', XIconsetSvg);


export { XIconsetSvg }
