//import

import {
    ValAuthEngine,
    type ValAuthData
} from "../client/Engine";
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
}

//class

/**
 * Sign On
 */
class ValAuth extends ValAuthEngine {

    /**
     * Create a new ValAuth Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    public constructor(options: ValAuthEngine.Options = {}) {
        super(options);
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

        const ValAuthLoginAuth = await ValUser.LoginForm(username, password);

        this.fromJSON(ValAuthLoginAuth);
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

        const ValAuthLoginAuth = await ValMultifactor.TwoFactor(verificationCode);

        this.fromJSON(ValAuthLoginAuth);
    }

    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValAuth.Expire>>}
     */
    public async refresh(force?: Boolean): Promise<Array<ValAuth.Expire>> {
        let expiresList: Array<ValAuth.Expire> = [];

        if ((new Date().getTime()) >= (this.createAt.cookie + Number(this.config.expiresIn?.cookie))) {
            //event
            expiresList.push({
                name: "cookie",
                data: this.cookie,
            });
            this.cookie.jar = new CookieJar();

            //uptodate
            this.createAt = {
                cookie: new Date().getTime(),
                token: new Date().getTime(),
            };
        }

        if ((new Date().getTime()) >= (this.createAt.token + Number(this.config.expiresIn?.token)) || force === true) {
            //event
            expiresList.push({
                name: "token",
                data: {
                    access_token: this.access_token,
                    id_token: this.id_token,
                },
            });
            this.access_token = '';

            if (!this.cookie.ssid) {
                return expiresList;
            }

            //uptodate
            this.createAt.token = new Date().getTime();

            //auto
            const ValCookie = new ValAuthCookie({
                config: this.config,
                data: this.toJSON(),
            });

            const ValAuthReAuth = await ValCookie.ReAuth();

            this.fromJSON(ValAuthReAuth);
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
        RsoClient.cookie.ssid = cookie;

        await RsoClient.refresh(true);

        return RsoClient;
    }
}

//export

export {
    ValAuth
};