"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsoAuthUser = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("../client/Engine");
const Auth_1 = require("../client/Auth");
const toUft8_1 = tslib_1.__importDefault(require("../utils/toUft8"));
const tough_cookie_1 = require("tough-cookie");
const http_1 = require("http-cookie-agent/http");
const Axios_1 = require("../client/Axios");
class RsoAuthUser {
    constructor(options) {
        var _a, _b;
        this.options = options;
        this.cookie = tough_cookie_1.CookieJar.fromJSON(JSON.stringify(options.data.cookie.jar));
        const _AxiosConfig = {
            headers: {
                "X-Riot-ClientVersion": ((_a = this.options.config.client) === null || _a === void 0 ? void 0 : _a.version) || Engine_1.CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": (0, toUft8_1.default)(JSON.stringify(((_b = this.options.config.client) === null || _b === void 0 ? void 0 : _b.platform) || Engine_1.CONFIG_ClientPlatform)),
            },
            httpsAgent: new http_1.HttpsCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true, ciphers: Engine_1.CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new http_1.HttpCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true }),
        };
        this.RsoAxios = new Axios_1.RsoAxios(new Object(Object.assign(Object.assign({}, _AxiosConfig), options.config.axiosConfig)));
    }
    //auth
    LoginForm(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //cookie
            const CookieResponse = yield this.RsoAxios.post('https://auth.riotgames.com/api/v1/authorization', {
                client_id: "play-valorant-web-prod",
                nonce: 1,
                redirect_uri: "https://playvalorant.com/opt_in",
                response_mode: "query",
                response_type: "token id_token",
                scope: "account openid",
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!CookieResponse.response.headers["set-cookie"]) {
                throw new Error('<cookie> Cookie is undefined');
            }
            const asid_cookie = CookieResponse.response.headers["set-cookie"].find((element) => /^asid/.test(element));
            if (!asid_cookie) {
                throw new Error('<asid> Cookie is undefined');
            }
            //token
            const TokenResponse = yield this.RsoAxios.put('https://auth.riotgames.com/api/v1/authorization', {
                'type': 'auth',
                'username': username,
                'password': password,
                'remember': true,
            }, {
                headers: {
                    Cookie: asid_cookie,
                }
            });
            //auth
            this.options.data.cookie.jar = this.cookie.toJSON();
            return yield (new Auth_1.RsoAuthClient(this.options)).fromResponse(TokenResponse);
        });
    }
    Token(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('In-Dev coming soon...');
        });
    }
}
exports.RsoAuthUser = RsoAuthUser;
//# sourceMappingURL=User.js.map