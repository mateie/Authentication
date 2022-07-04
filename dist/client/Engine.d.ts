import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";
interface RsoAuthType {
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
interface RsoClientPlatfrom {
    "platformType": string;
    "platformOS": string;
    "platformOSVersion": string;
    "platformChipset": string;
}
interface RsoOptions {
    client?: {
        version?: string;
        platform?: RsoClientPlatfrom;
    };
    axiosConfig?: AxiosRequestConfig;
    expiresIn?: {
        cookie: number;
        token?: number;
    };
}
declare const CONFIG_ClientVersion: string;
declare const CONFIG_ClientPlatform: RsoClientPlatfrom;
declare const CONFIG_UserAgent: string;
declare const CONFIG_Ciphers: Array<string>;
declare const CONFIG_DEFAULT: RsoOptions;
declare class RsoEngine {
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
    config: RsoOptions;
    /**
     * Create a new RSO Client
     * @param {RsoOptions} options Client Config
     */
    constructor(options?: RsoOptions);
    /**
     * To {@link RsoAuthType Save} Data
     * @returns {RsoAuthType}
     */
    toJSON(): RsoAuthType;
    /**
     * From {@link RsoAuthType Save} Data
     * @param {RsoAuthType} data `.toJSON()` data
     * @returns {void}
     */
    fromJSON(data: RsoAuthType): void;
    protected build(options: {
        config: RsoOptions;
        data: RsoAuthType;
    }): void;
}
export { RsoEngine, CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT };
export type { RsoAuthType, RsoClientPlatfrom, RsoOptions };
//# sourceMappingURL=Engine.d.ts.map