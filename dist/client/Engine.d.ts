import { ValEvent } from "@valapi/lib";
import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";
interface ValAuthData {
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
    multifactor: boolean;
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
declare namespace ValAuthEngine {
    interface ClientPlatfrom {
        "platformType": string;
        "platformOS": string;
        "platformOSVersion": string;
        "platformChipset": string;
    }
    interface Options {
        client?: {
            version?: string;
            platform?: ValAuthEngine.ClientPlatfrom;
        };
        axiosConfig?: AxiosRequestConfig;
        expiresIn?: {
            cookie: number;
            token?: number;
        };
    }
}
declare const CONFIG_ClientVersion: string;
declare const CONFIG_ClientPlatform: ValAuthEngine.ClientPlatfrom;
declare const CONFIG_UserAgent: string;
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
    multifactor: boolean;
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
    protected createAt: {
        cookie: number;
        token: number;
    };
    /**
     * Client Config
     */
    config: ValAuthEngine.Options;
    /**
     * Create a new ValAuth Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options?: ValAuthEngine.Options);
    /**
     * To {@link ValAuthData save} data
     * @returns {ValAuthData}
     */
    toJSON(): ValAuthData;
    /**
     * From {@link ValAuthData save} data
     * @param {ValAuthData} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    fromJSON(data: ValAuthData): void;
    protected build(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    }): void;
    parsePlayerUuid(token?: string): string;
}
export { ValAuthEngine, CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT };
export type { ValAuthData };
