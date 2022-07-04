"use strict";
//import
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_DEFAULT = exports.CONFIG_Ciphers = exports.CONFIG_UserAgent = exports.CONFIG_ClientVersion = exports.CONFIG_ClientPlatform = exports.RsoEngine = void 0;
const tough_cookie_1 = require("tough-cookie");
const toUft8_1 = __importDefault(require("../utils/toUft8"));
//class
const CONFIG_ClientVersion = `release-05.00-shipping-11-729462`;
exports.CONFIG_ClientVersion = CONFIG_ClientVersion;
const CONFIG_ClientPlatform = {
    "platformType": `PC`,
    "platformOS": `Windows`,
    "platformOSVersion": `10.0.19042.1.256.64bit`,
    "platformChipset": `Unknown`,
};
exports.CONFIG_ClientPlatform = CONFIG_ClientPlatform;
const CONFIG_UserAgent = `RiotClient/53.0.0.4494832.4470164 %s (Windows;10;;Professional, x64)`;
exports.CONFIG_UserAgent = CONFIG_UserAgent;
const CONFIG_Ciphers = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_CCM_8_SHA256',
    'TLS_AES_128_CCM_SHA256',
];
exports.CONFIG_Ciphers = CONFIG_Ciphers;
const CONFIG_DEFAULT = {
    client: {
        version: CONFIG_ClientVersion,
        platform: CONFIG_ClientPlatform,
    },
    axiosConfig: {
        headers: {
            "User-Agent": CONFIG_UserAgent,
            "X-Riot-ClientVersion": CONFIG_ClientVersion,
            "X-Riot-ClientPlatform": (0, toUft8_1.default)(JSON.stringify(CONFIG_ClientPlatform)),
        },
    },
    expiresIn: {
        cookie: 2592000000,
        token: 3600000,
    },
};
exports.CONFIG_DEFAULT = CONFIG_DEFAULT;
class RsoEngine {
    // class
    /**
     * Create a new RSO Client
     * @param {RsoOptions} options Client Config
     */
    constructor(options = {}) {
        this.cookie = {
            jar: new tough_cookie_1.CookieJar(),
            ssid: '',
        };
        this.access_token = '';
        this.id_token = '';
        this.expires_in = 3600;
        this.token_type = 'Bearer';
        this.session_state = '';
        this.entitlements_token = '';
        this.multifactor = false;
        this.isError = false;
        this.region = {
            pbe: 'na',
            live: 'na',
        };
        this.createAt = {
            cookie: new Date().getTime(),
            token: new Date().getTime(),
        };
        this.config = new Object(Object.assign(Object.assign({}, CONFIG_DEFAULT), options));
    }
    //save
    /**
     * To {@link RsoAuthType Save} Data
     * @returns {RsoAuthType}
     */
    toJSON() {
        return {
            cookie: {
                jar: this.cookie.jar.toJSON(),
                ssid: this.cookie.ssid,
            },
            access_token: this.access_token,
            id_token: this.id_token,
            expires_in: this.expires_in,
            token_type: this.token_type,
            session_state: this.session_state,
            entitlements_token: this.entitlements_token,
            multifactor: this.multifactor,
            isError: this.isError,
            region: this.region,
            createAt: this.createAt,
        };
    }
    /**
     * From {@link RsoAuthType Save} Data
     * @param {RsoAuthType} data `.toJSON()` data
     * @returns {void}
     */
    fromJSON(data) {
        this.cookie = {
            jar: tough_cookie_1.CookieJar.fromJSON(JSON.stringify(data.cookie.jar)),
            ssid: data.cookie.ssid,
        };
        this.access_token = data.access_token;
        this.id_token = data.id_token;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
        this.session_state = data.session_state;
        this.entitlements_token = data.entitlements_token;
        this.multifactor = data.multifactor;
        this.isError = data.isError;
        this.region = data.region;
        this.createAt = data.createAt;
    }
    build(options) {
        this.config = options.config;
        this.fromJSON(options.data);
    }
}
exports.RsoEngine = RsoEngine;
//# sourceMappingURL=Engine.js.map