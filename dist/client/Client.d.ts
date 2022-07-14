import { ValAuthEngine, type ValAuthData } from "../client/Engine";
import { CookieJar } from "tough-cookie";
declare namespace ValAuth {
    type Expire = {
        name: 'cookie';
        data: {
            jar: CookieJar;
            ssid: string;
        };
    } | {
        name: 'token';
        data: {
            access_token: string;
            id_token: string;
        };
    };
}
/**
 * Valorant Authentication
 */
declare class ValAuth extends ValAuthEngine {
    /**
     * Create a new ValAuth Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options?: ValAuthEngine.Options);
    /**
     * Login to Riot Account
     * @param {string} username Username
     * @param {string} password Password
     * @returns {Promise<void>}
     */
    login(username: string, password: string): Promise<void>;
    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    verify(verificationCode: number): Promise<void>;
    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValAuth.Expire>>}
     */
    refresh(force?: Boolean): Promise<Array<ValAuth.Expire>>;
    /**
     * From {@link toJSON toJSON()} data
     * @param {ValAuthData} data {@link toJSON toJSON()} data
     * @param {ValAuthEngine.Options} options Client Config
     * @returns {ValAuth}
     */
    static fromJSON(data: ValAuthData, options?: ValAuthEngine.Options): ValAuth;
    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValAuthEngine.Options} options Client Config
     * @returns {Promise<ValAuth>}
     */
    static fromCookie(cookie: string, options?: ValAuthEngine.Options): Promise<ValAuth>;
}
export { ValAuth };
