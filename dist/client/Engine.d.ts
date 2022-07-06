import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";
interface ValRsoAuthType {
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
declare namespace ValRsoEngine {
    interface ClientPlatfrom {
        "platformType": string;
        "platformOS": string;
        "platformOSVersion": string;
        "platformChipset": string;
    }
    interface Options {
        client?: {
            version?: string;
            platform?: ValRsoEngine.ClientPlatfrom;
        };
        axiosConfig?: AxiosRequestConfig;
        expiresIn?: {
            cookie: number;
            token?: number;
        };
    }
}
declare const CONFIG_ClientVersion: string;
declare const CONFIG_ClientPlatform: ValRsoEngine.ClientPlatfrom;
declare const CONFIG_UserAgent: string;
declare const CONFIG_Ciphers: Array<string>;
declare const CONFIG_DEFAULT: ValRsoEngine.Options;
declare class ValRsoEngine {
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
    config: ValRsoEngine.Options;
    /**
     * Create a new ValRso Client
     * @param {ValRsoEngine.Options} options Client Config
     */
    constructor(options?: ValRsoEngine.Options);
    /**
     * To {@link ValRsoAuthType save} data
     * @returns {ValRsoAuthType}
     */
    toJSON(): ValRsoAuthType;
    /**
     * From {@link ValRsoAuthType save} data
     * @param {ValRsoAuthType} data {@link toJSON toJSON()} data
     * @returns {void}
     */
    fromJSON(data: ValRsoAuthType): void;
    protected build(options: {
        config: ValRsoEngine.Options;
        data: ValRsoAuthType;
    }): void;
    parsePlayerUuid(token?: string): string;
}
export { ValRsoEngine, CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_UserAgent, CONFIG_Ciphers, CONFIG_DEFAULT };
export type { ValRsoAuthType };
//# sourceMappingURL=Engine.d.ts.map