//import

import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";

import toUft8 from "../utils/toUft8";

//interface

interface ValRsoAuthType {
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
    multifactor: boolean;
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

// options

interface ValRsoClientPlatfrom {
    "platformType": string;
    "platformOS": string;
    "platformOSVersion": string;
    "platformChipset": string;
}

interface ValRsoOptions {
    client?: {
        version?: string,
        platform?: ValRsoClientPlatfrom,
    };
    axiosConfig?: AxiosRequestConfig,
    expiresIn?: {
        cookie: number,
        token?: number,
    };
}

//class

const CONFIG_ClientVersion: string = `release-05.00-shipping-11-729462`;
const CONFIG_ClientPlatform: ValRsoClientPlatfrom = {
    "platformType": `PC`,
    "platformOS": `Windows`,
    "platformOSVersion": `10.0.19042.1.256.64bit`,
    "platformChipset": `Unknown`,
};
const CONFIG_UserAgent: string = `RiotClient/53.0.0.4494832.4470164 %s (Windows;10;;Professional, x64)`;

const CONFIG_Ciphers: Array<string> = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_CCM_8_SHA256',
    'TLS_AES_128_CCM_SHA256',
];

const CONFIG_DEFAULT: ValRsoOptions = {
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
}

class ValRsoEngine {
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
    public multifactor: boolean;
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
    protected createAt: {
        cookie: number,
        token: number,
    };

    /**
     * Client Config
     */
    public config: ValRsoOptions

    // class

    /**
     * Create a new ValRso Client
     * @param {ValRsoOptions} options Client Config
     */
    public constructor(options: ValRsoOptions = {}) {
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

        this.config = new Object({ ...CONFIG_DEFAULT, ...options });
    }

    //save

    /**
     * To {@link ValRsoAuthType save} data
     * @returns {ValRsoAuthType}
     */
    public toJSON(): ValRsoAuthType {
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
        }
    }

    /**
     * From {@link ValRsoAuthType save} data
     * @param {ValRsoAuthType} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    public fromJSON(data: ValRsoAuthType): void {
        this.cookie = {
            jar: CookieJar.fromJSON(JSON.stringify(data.cookie.jar)),
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

    //engine

    protected build(options: { config: ValRsoOptions, data: ValRsoAuthType }): void {
        this.config = options.config;

        this.fromJSON(options.data);
    }

    public parsePlayerUuid(token: string = this.access_token): string {
        const split_token: Array<string> = String(token).split('.');
        const _token: { sub: string } = JSON.parse(Buffer.from(split_token[1], 'base64').toString())
        
        return _token.sub;
    }
}

export {
    ValRsoEngine,
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT
};
export type {
    ValRsoAuthType, ValRsoClientPlatfrom, ValRsoOptions
};