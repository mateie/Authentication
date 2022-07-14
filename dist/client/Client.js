"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAuth = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("../client/Engine");
const tough_cookie_1 = require("tough-cookie");
const User_1 = require("../service/User");
const Multifactor_1 = require("../service/Multifactor");
const Cookie_1 = require("../service/Cookie");
//class
/**
 * Valorant Authentication
 */
class ValAuth extends Engine_1.ValAuthEngine {
    /**
     * Create a new ValAuth Client
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options = {}) {
        super(options);
    }
    //auth
    /**
     * Login to Riot Account
     * @param {string} username Username
     * @param {string} password Password
     * @returns {Promise<void>}
     */
    login(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ValUser = new User_1.ValAuthUser({
                config: this.config,
                data: this.toJSON(),
            });
            const ValAuthLoginAuth = yield ValUser.LoginForm(username, password);
            this.fromJSON(ValAuthLoginAuth);
        });
    }
    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    verify(verificationCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ValMultifactor = new Multifactor_1.ValAuthMultifactor({
                config: this.config,
                data: this.toJSON(),
            });
            const ValAuthLoginAuth = yield ValMultifactor.TwoFactor(verificationCode);
            this.fromJSON(ValAuthLoginAuth);
        });
    }
    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValAuth.Expire>>}
     */
    refresh(force) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let expiresList = [];
            if ((new Date().getTime()) >= (this.createAt.cookie + Number((_a = this.config.expiresIn) === null || _a === void 0 ? void 0 : _a.cookie))) {
                //event
                expiresList.push({
                    name: "cookie",
                    data: this.cookie,
                });
                this.cookie.jar = new tough_cookie_1.CookieJar();
                //uptodate
                this.createAt = {
                    cookie: new Date().getTime(),
                    token: new Date().getTime(),
                };
            }
            if ((new Date().getTime()) >= (this.createAt.token + Number((_b = this.config.expiresIn) === null || _b === void 0 ? void 0 : _b.token)) || force === true) {
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
                const ValCookie = new Cookie_1.ValAuthCookie({
                    config: this.config,
                    data: this.toJSON(),
                });
                const ValAuthReAuth = yield ValCookie.ReAuth();
                this.fromJSON(ValAuthReAuth);
            }
            return expiresList;
        });
    }
    //static
    /**
     * From {@link toJSON toJSON()} data
     * @param {ValAuthData} data {@link toJSON toJSON()} data
     * @param {ValAuthEngine.Options} options Client Config
     * @returns {ValAuth}
     */
    static fromJSON(data, options) {
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
    static fromCookie(cookie, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const RsoClient = new ValAuth(options);
            RsoClient.cookie.ssid = cookie;
            yield RsoClient.refresh(true);
            return RsoClient;
        });
    }
}
exports.ValAuth = ValAuth;
