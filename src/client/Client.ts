//import

import {
    RsoEngine,
    type RsoOptions
} from "./Engine";
import { CookieJar } from "tough-cookie";

import { RsoAuthUser } from "../service/User";
import { RsoAuthMultifactor } from "../service/Multifactor";
import { RsoAuthCookie } from "../service/Cookie";

//interface

type RsoExpire = {
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

class RsoClient extends RsoEngine {

    /**
     * Create a new RSO Client
     * @param {RsoOptions} options Client Config
     */
    public constructor(options: RsoOptions = {}) {
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
        const RsoUser = new RsoAuthUser({
            config: this.config,
            data: this.toJSON(),
        });

        const RsoLoginAuth = await RsoUser.LoginForm(username, password);

        this.fromJSON(RsoLoginAuth);
    }

    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    public async verify(verificationCode: number): Promise<void> {
        const RsoMultifactor = new RsoAuthMultifactor({
            config: this.config,
            data: this.toJSON(),
        });

        const RsoLoginAuth = await RsoMultifactor.TwoFactor(verificationCode);

        this.fromJSON(RsoLoginAuth);
    }

    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<RsoExpire>>}
     */
    public async reload(force?: Boolean): Promise<Array<RsoExpire>> {
        let expiresList: Array<RsoExpire> = [];

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
            const RsoCookie = new RsoAuthCookie({
                config: this.config,
                data: this.toJSON(),
            });

            const RsoReAuth = await RsoCookie.ReAuth();

            this.fromJSON(RsoReAuth);
        }

        return expiresList;
    }
}

export {
    RsoClient
};

export type {
    RsoExpire
};