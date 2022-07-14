"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAuthMultifactor = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("../client/Engine");
const Auth_1 = require("../client/Auth");
const lib_1 = require("@valapi/lib");
const tough_cookie_1 = require("tough-cookie");
const http_1 = require("http-cookie-agent/http");
const axios_1 = tslib_1.__importDefault(require("axios"));
//class
class ValAuthMultifactor {
    constructor(options) {
        var _a, _b;
        this.options = options;
        this.cookie = tough_cookie_1.CookieJar.fromJSON(JSON.stringify(options.data.cookie.jar));
        const _AxiosConfig = {
            headers: {
                Cookie: this.options.data.cookie.ssid,
                "X-Riot-ClientVersion": ((_a = this.options.config.client) === null || _a === void 0 ? void 0 : _a.version) || Engine_1.CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": (0, lib_1.toUft8)(JSON.stringify(((_b = this.options.config.client) === null || _b === void 0 ? void 0 : _b.platform) || Engine_1.CONFIG_ClientPlatform)),
            },
            httpsAgent: new http_1.HttpsCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true, ciphers: Engine_1.CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new http_1.HttpCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true }),
        };
        this.ValAuthAxios = axios_1.default.create(new Object(Object.assign(Object.assign({}, _AxiosConfig), options.config.axiosConfig)));
    }
    //auth
    TwoFactor(verificationCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //token
            const TokenResponse = yield this.ValAuthAxios.put('https://auth.riotgames.com/api/v1/authorization', {
                "type": "multifactor",
                "code": String(verificationCode),
                "rememberDevice": true,
            });
            if (TokenResponse.data.type === 'response') {
                this.options.data.multifactor = false;
            }
            else {
                this.options.data.isError = true;
            }
            //auth
            this.options.data.cookie.jar = this.cookie.toJSON();
            return yield (new Auth_1.ValAuthCore(this.options)).fromResponse(TokenResponse);
        });
    }
}
exports.ValAuthMultifactor = ValAuthMultifactor;
