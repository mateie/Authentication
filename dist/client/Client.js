"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValRso = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("./Engine");
const tough_cookie_1 = require("tough-cookie");
const User_1 = require("../service/User");
const Multifactor_1 = require("../service/Multifactor");
const Cookie_1 = require("../service/Cookie");
//class
class ValRso extends Engine_1.ValRsoEngine {
    /**
     * Create a new ValRso Client
     * @param {ValRsoEngine.Options} options Client Config
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
            const ValRsoUser = new User_1.ValRsoAuthUser({
                config: this.config,
                data: this.toJSON(),
            });
            const ValRsoLoginAuth = yield ValRsoUser.LoginForm(username, password);
            this.fromJSON(ValRsoLoginAuth);
        });
    }
    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    verify(verificationCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ValRsoMultifactor = new Multifactor_1.ValRsoAuthMultifactor({
                config: this.config,
                data: this.toJSON(),
            });
            const ValRsoLoginAuth = yield ValRsoMultifactor.TwoFactor(verificationCode);
            this.fromJSON(ValRsoLoginAuth);
        });
    }
    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<ValRso.Expire>>}
     */
    reload(force) {
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
                //uptodate
                this.createAt.token = new Date().getTime();
                //auto
                const ValRsoCookie = new Cookie_1.ValRsoAuthCookie({
                    config: this.config,
                    data: this.toJSON(),
                });
                const ValRsoReAuth = yield ValRsoCookie.ReAuth();
                this.fromJSON(ValRsoReAuth);
            }
            return expiresList;
        });
    }
    //static
    /**
     * From {@link toJSON toJSON()} data
     * @param {ValRsoAuthType} data {@link toJSON toJSON()} data
     * @param {ValRsoEngine.Options} options Client Config
     * @returns {ValRso}
     */
    static fromJSON(data, options) {
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
    static fromCookie(cookie, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const RsoClient = new ValRso(options);
            RsoClient.cookie.ssid = cookie;
            yield RsoClient.reload(true);
            return RsoClient;
        });
    }
}
exports.ValRso = ValRso;
//# sourceMappingURL=Client.js.map