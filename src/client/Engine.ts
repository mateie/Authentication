//import

import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";

import toUft8 from "../utils/toUft8";
import EventEmitter from "events";

//interface

interface RsoAuthType {
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

interface RsoClientPlatfrom {
    "platformType": string;
    "platformOS": string;
    "platformOSVersion": string;
    "platformChipset": string;
}

interface RsoOptions {
    client?: {
        version?: string,
        platform?: RsoClientPlatfrom,
    };
    axiosConfig?: AxiosRequestConfig,
    expiresIn?: {
        cookie: number,
        token?: number,
    };
}

//class

const CONFIG_ClientVersion: string = `release-05.00-shipping-6-725355`;
const CONFIG_ClientPlatform: RsoClientPlatfrom = {
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

const _defaultConfig: RsoOptions = {
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

class RsoEngine extends EventEmitter {
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
    public multifactor: boolean;
    public isError: boolean;
    public region: {
        pbe: string,
        live: string,
    };
    protected createAt: {
        cookie: number,
        token: number,
    };

    public config: RsoOptions

    // class

    public constructor(options: RsoOptions = {}) {
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

        this.config = new Object({ ..._defaultConfig, ...options });
    }

    //save

    public toJSON(): RsoAuthType {
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

    public fromJSON(data: RsoAuthType): void {
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

    protected build(options: { config: RsoOptions, data: RsoAuthType }): void {
        this.config = options.config;

        this.fromJSON(options.data);
    }
}

export {
    RsoEngine,
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, _defaultConfig as CONFIG_DEFAULT
};
export type {
    RsoAuthType, RsoClientPlatfrom, RsoOptions
};