import { RsoEngine, type RsoOptions } from "./Engine";
import { CookieJar } from "tough-cookie";
declare type RsoExpire = {
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
declare class RsoClient extends RsoEngine {
    /**
     * Create a new RSO Client
     * @param {RsoOptions} options Client Config
     */
    constructor(options?: RsoOptions);
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
     * @returns {Promise<Array<RsoExpire>>}
     */
    reload(force?: Boolean): Promise<Array<RsoExpire>>;
}
export { RsoClient };
export type { RsoExpire };
//# sourceMappingURL=Client.d.ts.map