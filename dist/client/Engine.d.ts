import { ValEvent } from "@valapi/lib";
import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";
declare namespace ValAuthEngine {
    /**
     * Client Data
     */
    interface Json {
        cookie: {
            jar: CookieJar.Serialized;
            ssid: string;
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
            pbe: string;
            live: string;
        };
        createAt: {
            cookie: number;
            token: number;
        };
    }
    /**
     * Client Platfrom
     */
    interface ClientPlatfrom {
        "platformType": string;
        "platformOS": string;
        "platformOSVersion": string;
        "platformChipset": string;
    }
    /**
     * Client Config
     */
    interface Options {
        client?: {
            version?: string;
            platform?: ValAuthEngine.ClientPlatfrom;
        };
        axiosConfig?: AxiosRequestConfig;
        expiresIn?: {
            cookie?: number;
            token?: number;
        };
    }
}
declare const CONFIG_ClientVersion = "release-05.04-shipping-11-751550";
declare const CONFIG_ClientPlatform: ValAuthEngine.ClientPlatfrom;
declare const CONFIG_UserAgent = "RiotClient/53.0.0.4494832.4470164 %s (Windows;10;;Professional, x64)";
declare const CONFIG_Ciphers: Array<string>;
declare const CONFIG_DEFAULT: ValAuthEngine.Options;
declare class ValAuthEngine extends ValEvent {
    protected cookie: {
        jar: CookieJar;
        ssid: string;
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
    isMultifactor: boolean;
    /**
     * is Authentication Error ?
     */
    isError: boolean;
    /**
     * Server Region
     */
    region: {
        pbe: string;
        live: string;
    };
    /**
     * Create At (date)
     */
    createAt: {
        cookie: number;
        token: number;
    };
    /**
     * Client Config
     */
    config: ValAuthEngine.Options;
    /**
     * Create a new {@link ValAuthEngine} Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options?: ValAuthEngine.Options);
    /**
     *
     * @returns {ValAuthEngine.Json}
     */
    toJSON(): ValAuthEngine.Json;
    /**
     *
     * @param {ValAuthEngine.Json} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    fromJSON(data: ValAuthEngine.Json): void;
    protected build(options: {
        config: ValAuthEngine.Options;
        data: ValAuthEngine.Json;
    }): void;
    /**
     *
     * @param {string} token Access Token
     * @returns {string} Subject
     */
    parseToken(token?: string): string;
    /**
     * Default Client Config
     */
    static readonly Default: {
        client: {
            version: string;
            platform: ValAuthEngine.ClientPlatfrom;
        };
        userAgent: string;
        ciphers: string;
        config: ValAuthEngine.Options;
    };
}
export { ValAuthEngine, CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT };
