/**
 * This iconset is using an image reference to the external svg (./bytesize-icons.svg).
 *
 * Iconset from https://github.com/danklammer/bytesize-icons
 */

import '../../x-iconset-svg.js';
import '../../x-icon.js';

const svgHref = import.meta.url.replace(/js$/, 'svg');
const template = document.createElement('template');
template.innerHTML = `<x-iconset-svg name="bytesize" href="${svgHref}"
icons="i-search i-close i-plus i-minus i-play i-pause i-backwards i-forwards i-move i-star i-checkmark i-chevron-top i-chevron-right i-chevron-bottom i-chevron-left i-arrow-top i-arrow-right i-arrow-bottom i-arrow-left i-caret-top i-caret-right i-caret-bottom i-caret-left i-start i-end i-eject i-mute i-volume i-ban i-flag i-options i-settings i-heart i-clock i-menu i-msg i-photo i-camera i-video i-music i-mail i-home i-user i-signin i-signout i-trash i-paperclip i-file i-folder i-folder-open i-work i-portfolio i-bell i-book i-calendar i-print i-eye i-bookmark i-tag i-lightning i-activity i-location i-export i-import i-inbox i-archive i-reply i-edit i-compose i-upload i-download i-send i-link i-code i-lock i-unlock i-alert i-info i-creditcard i-cart i-bag i-gift i-external i-reload i-clipboard i-microphone i-telephone i-desktop i-mobile i-ellipsis-horizontal i-ellipsis-vertical i-twitter i-github"
></x-iconset-svg>`;

const bytesizeIcons = template.content.firstChild;

document.head.appendChild(bytesizeIcons);

export { bytesizeIcons }
