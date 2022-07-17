"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_DEFAULT = exports.CONFIG_Ciphers = exports.CONFIG_UserAgent = exports.CONFIG_ClientVersion = exports.CONFIG_ClientPlatform = exports.ValAuthEngine = void 0;
const lib_1 = require("@valapi/lib");
const tough_cookie_1 = require("tough-cookie");
//class
const CONFIG_ClientVersion = `release-05.01-shipping-12-732296`;
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
            "X-Riot-ClientPlatform": (0, lib_1.toUft8)(JSON.stringify(CONFIG_ClientPlatform)),
        },
    },
    expiresIn: {
        cookie: 2592000000,
        token: 3600000,
    },
};
exports.CONFIG_DEFAULT = CONFIG_DEFAULT;
class ValAuthEngine extends lib_1.ValEvent {
    // class
    /**
     * Create a new {@link ValAuthEngine} Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options = {}) {
        super();
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
        this.isMultifactor = false;
        this.isError = false;
        this.region = {
            pbe: 'na',
            live: 'na',
        };
        this.createAt = {
            cookie: new Date().getTime(),
            token: new Date().getTime(),
        };
        this.config = Object.assign(Object.assign({}, CONFIG_DEFAULT), options);
    }
    //save
    /**
     * To {@link ValAuthData save} data
     * @returns {ValAuthData}
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
            isMultifactor: this.isMultifactor,
            isError: this.isError,
            region: this.region,
            createAt: this.createAt,
        };
    }
    /**
     * From {@link ValAuthData save} data
     * @param {ValAuthData} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    fromJSON(data) {
        this.cookie = {
            jar: tough_cookie_1.CookieJar.fromJSON(JSON.stringify(data.cookie.jar)),
            ssid: data.cookie.ssid,
        };
        this.access_token = data.access_token;
        this.id_token = data.id_token || '';
        this.expires_in = data.expires_in || 3600;
        this.token_type = data.token_type || 'Bearer';
        this.session_state = data.session_state || '';
        this.entitlements_token = data.entitlements_token;
        this.isMultifactor = data.isMultifactor;
        this.isError = data.isError;
        this.region = Object.assign({ live: "na", pbe: "na" }, data.region);
        this.createAt = data.createAt;
    }
    //engine
    build(options) {
        this.config = options.config;
        this.fromJSON(options.data);
    }
    /**
     *
     * @param {string} token Access Token
     * @returns {string} Player UUID
     */
    parsePlayerUuid(token = this.access_token) {
        const split_token = String(token).split('.');
        const _token = JSON.parse(Buffer.from(split_token[1], 'base64').toString());
        return _token.sub;
    }
}
exports.ValAuthEngine = ValAuthEngine;
//static
/**
 * Default Client Data
 */
ValAuthEngine.Default = {
    client: {
        version: CONFIG_ClientVersion,
        platform: CONFIG_ClientPlatform,
    },
    userAgent: CONFIG_UserAgent,
    ciphers: CONFIG_Ciphers.join(':'),
};
