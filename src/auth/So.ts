//import

import {
    ValSoEngine,
    type ValSoAuthType
} from "../client/Engine";
import { CookieJar } from "tough-cookie";

import { ValSoAuthUser } from "../service/User";
import { ValSoAuthMultifactor } from "../service/Multifactor";
import { ValSoAuthCookie } from "../service/Cookie";

//interface

namespace ValSo {
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
class ValSo extends ValSoEngine {

    /**
     * Create a new ValSo Client
     * @param {ValSoEngine.Options} options Client Config
     */
    public constructor(options: ValSoEngine.Options = {}) {
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
        const ValSoUser = new ValSoAuthUser({
            config: this.config,
            data: this.toJSON(),
        });

        const ValSoLoginAuth = await ValSoUser.LoginForm(username, password);

        this.fromJSON(ValSoLoginAuth);
    }

    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    public async verify(verificationCode: number): Promise<void> {
        const ValSoMultifactor = new ValSoAuthMultifactor({
            config: this.config,
            data: this.toJSON(),
        });

        const ValSoLoginAuth = await ValSoMultifactor.TwoFactor(verificationCode);

        this.fromJSON(ValSoLoginAuth);
    }

    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValSo.Expire>>}
     */
    public async reload(force?: Boolean): Promise<Array<ValSo.Expire>> {
        let expiresList: Array<ValSo.Expire> = [];

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

            //uptodate
            this.createAt.token = new Date().getTime();

            //auto
            const ValSoCookie = new ValSoAuthCookie({
                config: this.config,
                data: this.toJSON(),
            });

            const ValSoReAuth = await ValSoCookie.ReAuth();

            this.fromJSON(ValSoReAuth);
        }

        return expiresList;
    }

    //static

    /**
     * From {@link toJSON toJSON()} data
     * @param {ValSoAuthType} data {@link toJSON toJSON()} data
     * @param {ValSoEngine.Options} options Client Config
     * @returns {ValSo}
     */
    public static fromJSON(data: ValSoAuthType, options?: ValSoEngine.Options): ValSo {
        const RsoClient = new ValSo(options);
        RsoClient.fromJSON(data);

        return RsoClient;
    }

    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @param {ValSoEngine.Options} options Client Config
     * @returns {Promise<ValSo>}
     */
    public static async fromCookie(cookie: string, options?: ValSoEngine.Options): Promise<ValSo> {
        const RsoClient = new ValSo(options);
        RsoClient.cookie.ssid = cookie;

        await RsoClient.reload(true);

        return RsoClient;
    }
}

//export

export {
    ValSo
};