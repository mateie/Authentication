//import

import {
    ValRsoEngine,
    type ValRsoAuthType
} from "./Engine";
import { CookieJar } from "tough-cookie";

import { ValRsoAuthUser } from "../service/User";
import { ValRsoAuthMultifactor } from "../service/Multifactor";
import { ValRsoAuthCookie } from "../service/Cookie";

//interface

namespace ValRso {
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

class ValRso extends ValRsoEngine {

    /**
     * Create a new ValRso Client
     * @param {ValRsoEngine.Options} options Client Config
     */
    public constructor(options: ValRsoEngine.Options = {}) {
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
     * @returns {Promise<Array<ValRso.Expire>>}
     */
    public async reload(force?: Boolean): Promise<Array<ValRso.Expire>> {
        let expiresList: Array<ValRso.Expire> = [];

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
     * @param {ValRsoEngine.Options} options Client Config
     * @returns {ValRso}
     */
    public static fromJSON(data: ValRsoAuthType, options?: ValRsoEngine.Options): ValRso {
        const RsoClient = new ValRso(options);
        RsoClient.fromJSON(data);

        return RsoClient;
    }

    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValRsoEngine.Options} options Client Config
     * @returns {Promise<ValRso>}
     */
    public static async fromCookie(cookie: string, options?: ValRsoEngine.Options): Promise<ValRso> {
        const RsoClient = new ValRso(options);
        RsoClient.cookie.ssid = cookie;

        await RsoClient.reload(true);

        return RsoClient;
    }
}

//export

export {
    ValRso
};