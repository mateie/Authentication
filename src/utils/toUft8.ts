/**
 * 
 * @param {String} data Data
 * @param {String} unicode Encrypt mode (default: base64)
 */
function toUft8(data: string, unicode: BufferEncoding = 'base64'): string {
    return Buffer.from(data).toString(unicode);
}

export default toUft8;