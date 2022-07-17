import { ValAuthEngine, type ValAuthData } from "./Engine";
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
    interface Event {
        'ready': () => void;
        'expires': (data: ValAuth.Expire) => void;
        'error': (data: {
            name: 'ValAuth_Error';
            message: string;
            data?: any;
        }) => void;
    }
}
declare interface ValAuth {
    emit<EventName extends keyof ValAuth.Event>(name: EventName, ...args: Parameters<ValAuth.Event[EventName]>): void;
    on<EventName extends keyof ValAuth.Event>(name: EventName, callback: ValAuth.Event[EventName]): void;
    once<EventName extends keyof ValAuth.Event>(name: EventName, callback: ValAuth.Event[EventName]): void;
    off<EventName extends keyof ValAuth.Event>(name: EventName, callback?: ValAuth.Event[EventName]): void;
}
/**
 * Valorant Authentication
 */
declare class ValAuth extends ValAuthEngine {
    /**
     * Create a new {@link ValAuth} Client
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
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @returns {Promise<void>}
     */
    fromCookie(cookie: string): Promise<void>;
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
