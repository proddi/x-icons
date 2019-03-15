/**
 * This iconset is using inline svg images to avoid external resources.
 *
 */

import '../../x-iconset-svg.js';
import '../../x-icon.js';


const template = document.createElement('template');
template.innerHTML = `<x-iconset-svg name="line">

<svg viewBox="0 0 32 32" style="stroke:currentColor;stroke-width:3px;"><defs>
  <line id="x" x1="5%" y1="5%" x2="95%" y2="95%"/>
  <line id="y" x1="5%" y1="95%" x2="95%" y2="5%"/>
  <g id="xy">
    <line x1="5%" y1="5%" x2="95%" y2="95%"/>
    <line x1="5%" y1="95%" x2="95%" y2="5%"/>
  </g>
</defs></svg>

<svg viewBox="0 0 24 24"><defs>
  <g id="transit"><path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"></path></g>
</defs></svg>

</x-iconset-svg>`;


document.head.appendChild(template.content.firstChild);
