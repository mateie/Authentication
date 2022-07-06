import { ValRsoEngine, type ValRsoAuthType } from "./Engine";
import { CookieJar } from "tough-cookie";
declare namespace ValRso {
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
declare class ValRso extends ValRsoEngine {
    /**
     * Create a new ValRso Client
     * @param {ValRsoEngine.Options} options Client Config
     */
    constructor(options?: ValRsoEngine.Options);
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
     * @returns {Promise<Array<ValRso.Expire>>}
     */
    reload(force?: Boolean): Promise<Array<ValRso.Expire>>;
    /**
     * From {@link toJSON toJSON()} data
     * @param {ValRsoAuthType} data {@link toJSON toJSON()} data
     * @param {ValRsoEngine.Options} options Client Config
     * @returns {ValRso}
     */
    static fromJSON(data: ValRsoAuthType, options?: ValRsoEngine.Options): ValRso;
    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValRsoEngine.Options} options Client Config
     * @returns {Promise<ValRso>}
     */
    static fromCookie(cookie: string, options?: ValRsoEngine.Options): Promise<ValRso>;
}
export { ValRso };
//# sourceMappingURL=Client.d.ts.map