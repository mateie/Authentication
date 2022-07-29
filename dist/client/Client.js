"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAuth = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("./Engine");
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
     * Create a new {@link ValAuth Client}
     * @param {ValAuthEngine.Options} options Client Config
     */
    constructor(options = {}) {
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
    login(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ValUser = new User_1.ValAuthUser({
                config: this.config,
                data: this.toJSON(),
            });
            try {
                const ValUserAuth = yield ValUser.LoginForm(username, password);
                if (ValUserAuth.isError === true) {
                    this.emit('error', {
                        name: 'ValAuth_Error',
                        message: 'Login Error',
                        data: ValUserAuth
                    });
                }
                this.fromJSON(ValUserAuth);
            }
            catch (error) {
                this.emit('error', {
                    name: 'ValAuth_Error',
                    message: String(error)
                });
            }
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
            try {
                const ValMultifactorAuth = yield ValMultifactor.TwoFactor(verificationCode);
                if (ValMultifactorAuth.isError === true) {
                    this.emit('error', {
                        name: 'ValAuth_Error',
                        message: 'Multifactor Error',
                        data: ValMultifactorAuth
                    });
                }
                this.fromJSON(ValMultifactorAuth);
            }
            catch (error) {
                this.emit('error', {
                    name: 'ValAuth_Error',
                    message: String(error)
                });
            }
        });
    }
    /**
     * From ssid Cookie
     * @param {string} cookie ssid Cookie
     * @returns {Promise<void>}
     */
    fromCookie(cookie) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.cookie.ssid = cookie;
            yield this.refresh(true);
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
            const expiresList = [];
            if ((new Date().getTime() + 10000) >= (this.createAt.cookie + Number((_a = this.config.expiresIn) === null || _a === void 0 ? void 0 : _a.cookie))) {
                //event
                const _event = {
                    name: "cookie",
                    data: this.cookie,
                };
                this.emit("expires", _event);
                expiresList.push(_event);
                //uptodate
                this.createAt.cookie = new Date().getTime();
                this.cookie.jar = new tough_cookie_1.CookieJar();
            }
            if ((new Date().getTime() + 10000) >= (this.createAt.token + Number((_b = this.config.expiresIn) === null || _b === void 0 ? void 0 : _b.token)) || force === true) {
                //event
                const _event = {
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
                const ValCookie = new Cookie_1.ValAuthCookie({
                    config: this.config,
                    data: this.toJSON(),
                });
                try {
                    const ValReAuth = yield ValCookie.ReAuthorize();
                    if (ValReAuth.isError === true) {
                        this.emit('error', {
                            name: 'ValAuth_Error',
                            message: 'Cookie Reauth Error',
                            data: ValReAuth
                        });
                    }
                    this.fromJSON(ValReAuth);
                }
                catch (error) {
                    this.emit('error', {
                        name: 'ValAuth_Error',
                        message: String(error)
                    });
                }
            }
            return expiresList;
        });
    }
    //static
    /**
     *
     * @param {ValAuthEngine.Json} data {@link toJSON toJSON()} data
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
            yield RsoClient.fromCookie(cookie);
            return RsoClient;
        });
    }
}
exports.ValAuth = ValAuth;
