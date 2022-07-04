//import

import {
    ValRsoEngine,
    type ValRsoOptions,
    type ValRsoAuthType,
} from "./Engine";
import { CookieJar } from "tough-cookie";

import { ValRsoAuthUser } from "../service/User";
import { ValRsoAuthMultifactor } from "../service/Multifactor";
import { ValRsoAuthCookie } from "../service/Cookie";

//interface

type ValRsoExpire = {
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

//class

class ValRsoClient extends ValRsoEngine {

    /**
     * Create a new ValRso Client
     * @param {ValRsoOptions} options Client Config
     */
    public constructor(options: ValRsoOptions = {}) {
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
        const ValRsoUser = new ValRsoAuthUser({
            config: this.config,
            data: this.toJSON(),
        });

        const ValRsoLoginAuth = await ValRsoUser.LoginForm(username, password);

        this.fromJSON(ValRsoLoginAuth);
    }

    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    public async verify(verificationCode: number): Promise<void> {
        const ValRsoMultifactor = new ValRsoAuthMultifactor({
            config: this.config,
            data: this.toJSON(),
        });

        const ValRsoLoginAuth = await ValRsoMultifactor.TwoFactor(verificationCode);

        this.fromJSON(ValRsoLoginAuth);
    }

    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValRsoExpire>>}
     */
    public async reload(force?: Boolean): Promise<Array<ValRsoExpire>> {
        let expiresList: Array<ValRsoExpire> = [];

        if ((new Date().getTime()) >= (this.createAt.cookie + Number(this.config.expiresIn?.cookie))) {
            //event
            expiresList.push({
                name: "cookie",
                data: this.cookie,
            })
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
            })
            this.access_token = '';

            //uptodate
            this.createAt.token = new Date().getTime();

            //auto
            const ValRsoCookie = new ValRsoAuthCookie({
                config: this.config,
                data: this.toJSON(),
            });

            const ValRsoReAuth = await ValRsoCookie.ReAuth();

            this.fromJSON(ValRsoReAuth);
        }

        return expiresList;
    }

    //static

    /**
     * From {@link toJSON toJSON()} data
     * @param {ValRsoAuthType} data {@link toJSON toJSON()} data
     * @param {ValRsoOptions} options Client Config
     * @returns {ValRsoClient}
     */
    public static fromJSON(data: ValRsoAuthType, options?: ValRsoOptions): ValRsoClient {
        const RsoClient = new ValRsoClient(options);
        RsoClient.fromJSON(data);

        return RsoClient;
    }

    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValRsoOptions} options Client Config
     * @returns {Promise<ValRsoClient>}
     */
    public static async fromCookie(cookie: string, options?: ValRsoOptions): Promise<ValRsoClient> {
        const RsoClient = new ValRsoClient(options);
        RsoClient.cookie.ssid = cookie;

        await RsoClient.reload(true);

        return RsoClient;
    }
}

export {
    ValRsoClient
};

export type {
    ValRsoExpire
};