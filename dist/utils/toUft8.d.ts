/// <reference types="node" />
/**
 *
 * @param {String} data Data
 * @param {String} unicode Encrypt mode (default: base64)
 */
declare function toUft8(data: string, unicode?: BufferEncoding): string;
export default toUft8;
