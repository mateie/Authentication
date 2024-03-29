//import

import { ValEvent, toUft8 } from "@valapi/lib";

import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";

//interface

namespace ValAuthEngine {
    /**
     * Client Data
     */
    export interface Json {
        cookie: {
            jar: CookieJar.Serialized,
            ssid: string,
        };
        access_token: string;
        id_token: string;
        expires_in: number;
        token_type: string;
        session_state: string;
        entitlements_token: string;
        isMultifactor: boolean;
        isError: boolean;
        region: {
            pbe: string,
            live: string,
        };
        createAt: {
            cookie: number,
            token: number,
        };
    }

    /**
     * Client Platfrom
     */
    export interface ClientPlatfrom {
        "platformType": string;
        "platformOS": string;
        "platformOSVersion": string;
        "platformChipset": string;
    }

    /**
     * Client Config
     */
    export interface Options {
        client?: {
            version?: string,
            platform?: ValAuthEngine.ClientPlatfrom,
        };
        axiosConfig?: AxiosRequestConfig,
        expiresIn?: {
            cookie?: number,
            token?: number,
        };
    }
}

//class

const CONFIG_ClientVersion = `release-05.04-shipping-11-751550`;
const CONFIG_ClientPlatform: ValAuthEngine.ClientPlatfrom = {
    "platformType": `PC`,
    "platformOS": `Windows`,
    "platformOSVersion": `10.0.19042.1.256.64bit`,
    "platformChipset": `Unknown`,
};
const CONFIG_UserAgent = `RiotClient/53.0.0.4494832.4470164 %s (Windows;10;;Professional, x64)`;

const CONFIG_Ciphers: Array<string> = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_CCM_8_SHA256',
    'TLS_AES_128_CCM_SHA256',
];

const CONFIG_DEFAULT: ValAuthEngine.Options = {
    client: {
        version: CONFIG_ClientVersion,
        platform: CONFIG_ClientPlatform,
    },
    axiosConfig: {
        headers: {
            "User-Agent": CONFIG_UserAgent,
            "X-Riot-ClientVersion": CONFIG_ClientVersion,
            "X-Riot-ClientPlatform": toUft8(JSON.stringify(CONFIG_ClientPlatform)),
        },
    },
    expiresIn: { //Milliseconds
        cookie: 2592000000,
        token: 3600000,
    },
};

class ValAuthEngine extends ValEvent {
    protected cookie: {
        jar: CookieJar,
        ssid: string,
    };
    protected access_token: string;
    protected id_token: string;
    protected expires_in: number;
    protected token_type: string;
    protected session_state: string;
    protected entitlements_token: string;
    /**
     * is Multifactor Account ?
     */
    public isMultifactor: boolean;
    /**
     * is Authentication Error ?
     */
    public isError: boolean;
    /**
     * Server Region
     */
    public region: {
        pbe: string,
        live: string,
    };
    /**
     * Create At (date)
     */
    public createAt: {
        cookie: number,
        token: number,
    };

    /**
     * Client Config
     */
    public config: ValAuthEngine.Options;

    // class

    /**
     * Create a new {@link ValAuthEngine} Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    public constructor(options: ValAuthEngine.Options = {}) {
        super();

        this.cookie = {
            jar: new CookieJar(),
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

        this.config = { ...CONFIG_DEFAULT, ...options };
    }

    //save

    /**
     * 
     * @returns {ValAuthEngine.Json}
     */
    public toJSON(): ValAuthEngine.Json {
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
     * 
     * @param {ValAuthEngine.Json} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    public fromJSON(data: ValAuthEngine.Json): void {
        this.cookie = {
            jar: CookieJar.fromJSON(JSON.stringify(data.cookie.jar)),
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
        this.region = { ...{ live: "na", pbe: "na" }, ...data.region };
        this.createAt = data.createAt;
    }

    //engine

    protected build(options: { config: ValAuthEngine.Options, data: ValAuthEngine.Json }): void {
        this.config = options.config;

        this.fromJSON(options.data);
    }

    /**
     * 
     * @param {string} token Access Token
     * @returns {string} Subject
     */
    public parseToken(token: string = this.access_token): string {
        const split_token: Array<string> = String(token).split('.');
        const _token: { sub: string } = JSON.parse(Buffer.from(split_token[1], 'base64').toString());

        return _token.sub;
    }

    //static

    /**
     * Default Client Config
     */
    public static readonly Default = {
        client: {
            version: CONFIG_ClientVersion,
            platform: CONFIG_ClientPlatform,
        },
        userAgent: CONFIG_UserAgent,
        ciphers: CONFIG_Ciphers.join(':'),
        config: CONFIG_DEFAULT,
    };
}

//export

export {
    ValAuthEngine,
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT
};