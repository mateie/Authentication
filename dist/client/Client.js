"use strict";
//import
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsoClient = void 0;
const Engine_1 = require("./Engine");
const tough_cookie_1 = require("tough-cookie");
const User_1 = require("../service/User");
const Multifactor_1 = require("../service/Multifactor");
const Cookie_1 = require("../service/Cookie");
//class
class RsoClient extends Engine_1.RsoEngine {
    /**
     * Create a new RSO Client
     * @param {RsoOptions} options Client Config
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
        return __awaiter(this, void 0, void 0, function* () {
            const RsoUser = new User_1.RsoAuthUser({
                config: this.config,
                data: this.toJSON(),
            });
            const RsoLoginAuth = yield RsoUser.LoginForm(username, password);
            this.fromJSON(RsoLoginAuth);
        });
    }
    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    verify(verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const RsoMultifactor = new Multifactor_1.RsoAuthMultifactor({
                config: this.config,
                data: this.toJSON(),
            });
            const RsoLoginAuth = yield RsoMultifactor.TwoFactor(verificationCode);
            this.fromJSON(RsoLoginAuth);
        });
    }
    /**
     * Reconnect to the server
     * @param force force to reload (only token)
     * @returns {Promise<Array<RsoExpire>>}
     */
    reload(force) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
                const RsoCookie = new Cookie_1.RsoAuthCookie({
                    config: this.config,
                    data: this.toJSON(),
                });
                const RsoReAuth = yield RsoCookie.ReAuth();
                this.fromJSON(RsoReAuth);
            }
            return expiresList;
        });
    }
}
exports.RsoClient = RsoClient;
//# sourceMappingURL=Client.js.map