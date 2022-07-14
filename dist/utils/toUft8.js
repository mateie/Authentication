"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param {String} data Data
 * @param {String} unicode Encrypt mode (default: base64)
 */
function toUft8(data, unicode = 'base64') {
    return Buffer.from(data).toString(unicode);
}
exports.default = toUft8;
