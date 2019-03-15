/**
 * This iconset is using an image reference to the external png (./raster-icons-64.png).
 *
 */

import '../../x-iconset-img.js';
import '../../x-icon.js';

const imgSrc = import.meta.url.replace(/\.js$/, '-64.png');
const template = document.createElement('template');
template.innerHTML = `
<x-iconset-img name="raster" width="256" icon-size="64" src="${imgSrc}"
    icons="favorite play valid map-marker place profile star home invalid star2 route preferences layers date my-profile">
</x-iconset-img>
`;

const node = document.importNode(template.content, true);
//document.head.appendChild(node);
const rasterIcons = node.querySelector('x-iconset-img');

export { rasterIcons }
