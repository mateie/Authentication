//import

import {
    ValAuthEngine,
    type ValAuthData
} from "./Engine";
import { CookieJar } from "tough-cookie";

import { ValAuthUser } from "../service/User";
import { ValAuthMultifactor } from "../service/Multifactor";
import { ValAuthCookie } from "../service/Cookie";

//interface

namespace ValAuth {
    export type Expire = {
        name: 'cookie';
        data: {
            jar: CookieJar,
            ssid: string,
        };
    } | {
        name: 'token';
        data: {
            access_token: string,
            id_token: string,
        };
    };

    export interface Event {
        'ready': () => void;
        'expires': (data: ValAuth.Expire) => void;
        'error': (data: { name: 'ValAuth_Error', message: string, data?: any }) => void;
    }
}

//event

declare interface ValAuth {
    emit<EventName extends keyof ValAuth.Event>(name: EventName, ...args: Parameters<ValAuth.Event[EventName]>): void;
    on<EventName extends keyof ValAuth.Event>(name: EventName, callback: ValAuth.Event[EventName]): void;
    once<EventName extends keyof ValAuth.Event>(name: EventName, callback: ValAuth.Event[EventName]): void;
    off<EventName extends keyof ValAuth.Event>(name: EventName, callback?: ValAuth.Event[EventName]): void;
}

//class

/**
 * Valorant Authentication
 */
class ValAuth extends ValAuthEngine {

    /**
     * Create a new {@link ValAuth} Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    public constructor(options: ValAuthEngine.Options = {}) {
        super(options);

        this.emit('ready');
    }

    //auth

    /**
     * Login to Riot Account
     * @param {string} username Username
     * @param {string} password Password
     * @returns {Promise<void>}
     */
    public async login(username: string, password: string): Promise<void> {
        const ValUser = new ValAuthUser({
            config: this.config,
            data: this.toJSON(),
        });

        try {
            const ValUserAuth = await ValUser.LoginForm(username, password);

            if (ValUserAuth.isError === true) {
                this.emit('error', {
                    name: 'ValAuth_Error',
                    message: 'Login Error',
                    data: ValUserAuth
                });
            }

            this.fromJSON(ValUserAuth);
        } catch (error) {
            this.emit('error', {
                name: 'ValAuth_Error',
                message: String(error)
            });
        }
    }

    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    public async verify(verificationCode: number): Promise<void> {
        const ValMultifactor = new ValAuthMultifactor({
            config: this.config,
            data: this.toJSON(),
        });

        try {
            const ValMultifactorAuth = await ValMultifactor.TwoFactor(verificationCode);

            if (ValMultifactorAuth.isError === true) {
                this.emit('error', {
                    name: 'ValAuth_Error',
                    message: 'Multifactor Error',
                    data: ValMultifactorAuth
                });
            }

            this.fromJSON(ValMultifactorAuth);
        } catch (error) {
            this.emit('error', {
                name: 'ValAuth_Error',
                message: String(error)
            });
        }
    }

    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @returns {Promise<void>}
     */
    public async fromCookie(cookie: string): Promise<void> {
        this.cookie.ssid = cookie;

        await this.refresh(true);
    }

    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValAuth.Expire>>}
     */
    public async refresh(force?: boolean): Promise<Array<ValAuth.Expire>> {
        const expiresList: Array<ValAuth.Expire> = [];

        if ((new Date().getTime() + 10000) >= (this.createAt.cookie + Number(this.config.expiresIn?.cookie))) {
            //event
            const _event: ValAuth.Expire = {
                name: "cookie",
                data: this.cookie,
            };
            this.emit("expires", _event);
            expiresList.push(_event);

            //uptodate
            this.cookie.jar = new CookieJar();

            this.createAt = {
                cookie: new Date().getTime(),
                token: new Date().getTime(),
            };
        }

        if ((new Date().getTime() + 10000) >= (this.createAt.token + Number(this.config.expiresIn?.token)) || force === true) {
            //event
            const _event: ValAuth.Expire = {
                name: "token",
                data: {
                    access_token: this.access_token,
                    id_token: this.id_token,
                },
            };
            this.emit("expires", _event);
            expiresList.push(_event);

            if (!this.cookie.ssid) {
                return expiresList;
            }

            //uptodate
            this.access_token = '';
            
            this.createAt.token = new Date().getTime();

            //auto
            const ValCookie = new ValAuthCookie({
                config: this.config,
                data: this.toJSON(),
            });

            try {
                const ValReAuth = await ValCookie.ReAuthorize();

                if (ValReAuth.isError === true) {
                    this.emit('error', {
                        name: 'ValAuth_Error',
                        message: 'Cookie Reauth Error',
                        data: ValReAuth
                    });
                }

                this.fromJSON(ValReAuth);
            } catch (error) {
                this.emit('error', {
                    name: 'ValAuth_Error',
                    message: String(error)
                });
            }
        }

        return expiresList;
    }

    //static

    /**
     * From {@link toJSON toJSON()} data
     * @param {ValAuthData} data {@link toJSON toJSON()} data
     * @param {ValAuthEngine.Options} options Client Config
     * @returns {ValAuth}
     */
    public static fromJSON(data: ValAuthData, options?: ValAuthEngine.Options): ValAuth {
        const RsoClient = new ValAuth(options);
        RsoClient.fromJSON(data);

        return RsoClient;
    }

    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValAuthEngine.Options} options Client Config
     * @returns {Promise<ValAuth>}
     */
    public static async fromCookie(cookie: string, options?: ValAuthEngine.Options): Promise<ValAuth> {
        const RsoClient = new ValAuth(options);
        await RsoClient.fromCookie(cookie);

        return RsoClient;
    }
}

//export

export {
    ValAuth
};