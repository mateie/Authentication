"use strict";
// import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValRsoAuth = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("../client/Engine");
const toUft8_1 = tslib_1.__importDefault(require("../utils/toUft8"));
const Axios_1 = require("../client/Axios");
const http_1 = require("http-cookie-agent/http");
// class
class ValRsoAuth extends Engine_1.ValRsoEngine {
    constructor(options) {
        var _a, _b;
        super();
        this.build({ config: options.config, data: options.data });
        this.options = options;
        //axios
        const _AxiosConfig = {
            headers: {
                Cookie: this.cookie.ssid,
                "User-Agent": Engine_1.CONFIG_UserAgent,
                "X-Riot-ClientVersion": ((_a = this.config.client) === null || _a === void 0 ? void 0 : _a.version) || Engine_1.CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": (0, toUft8_1.default)(JSON.stringify(((_b = this.config.client) === null || _b === void 0 ? void 0 : _b.platform) || Engine_1.CONFIG_ClientPlatform)),
            },
            httpsAgent: new http_1.HttpsCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true, ciphers: Engine_1.CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new http_1.HttpCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true }),
        };
        this.ValRsoAxios = new Axios_1.ValRsoAxios(new Object(Object.assign(Object.assign({}, _AxiosConfig), options.config.axiosConfig)));
    }
    // auth
    fromUrl(TokenUrl) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //TOKEN
            const Search_URL = new URL(TokenUrl);
            let Search_path = Search_URL.search;
            let Search_token = 'access_token';
            if (!Search_path) {
                if (!Search_URL.hash) {
                    this.isError = true;
                    return this.toJSON();
                }
                else {
                    Search_path = Search_URL.hash;
                    Search_token = `#${Search_token}`;
                }
            }
            this.access_token = String(new URLSearchParams(Search_path).get(Search_token));
            this.id_token = String(new URLSearchParams(Search_path).get('id_token'));
            this.expires_in = Number(new URLSearchParams(Search_path).get('expires_in')) || 3600;
            this.token_type = String(new URLSearchParams(Search_path).get('token_type')) || 'Bearer';
            this.session_state = String(new URLSearchParams(Search_path).get('session_state'));
            //ENTITLEMENTS
            const EntitlementsResponse = yield this.ValRsoAxios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                headers: {
                    'Authorization': `${this.token_type} ${this.access_token}`,
                },
            });
            this.entitlements_token = EntitlementsResponse.response.data.entitlements_token;
            //REGION
            const RegionResponse = yield this.ValRsoAxios.put('https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant', {
                id_token: this.id_token,
            }, {
                headers: {
                    'Authorization': `${this.token_type} ${this.access_token}`,
                    'X-Riot-Entitlements-JWT': this.entitlements_token,
                }
            });
            this.region.pbe = ((_b = (_a = RegionResponse.response.data) === null || _a === void 0 ? void 0 : _a.affinities) === null || _b === void 0 ? void 0 : _b.pbe) || 'na';
            this.region.live = ((_d = (_c = RegionResponse.response.data) === null || _c === void 0 ? void 0 : _c.affinities) === null || _d === void 0 ? void 0 : _d.live) || 'na';
            //output
            return this.toJSON();
        });
    }
    fromResponse(TokenResponse) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (TokenResponse.isError || !TokenResponse.response.data.type) {
                this.isError = true;
                return this.toJSON();
            }
            //MFA
            if (TokenResponse.response.data.type && TokenResponse.response.data.type == 'multifactor') {
                this.multifactor = true;
                return this.toJSON();
            }
            else {
                this.multifactor = false;
            }
            //COOKIE
            if (!TokenResponse.response.headers["set-cookie"]) {
                throw new Error('<cookie> Cookie is undefined');
            }
            const ssid_cookie = TokenResponse.response.headers["set-cookie"].find((element) => /^ssid/.test(element));
            if (!ssid_cookie) {
                throw new Error('<asid> Cookie is undefined');
            }
            this.cookie.ssid = ssid_cookie;
            //URL
            if (!TokenResponse.response.data.response || !((_a = TokenResponse.response.data.response) === null || _a === void 0 ? void 0 : _a.parameters) || !((_c = (_b = TokenResponse.response.data.response) === null || _b === void 0 ? void 0 : _b.parameters) === null || _c === void 0 ? void 0 : _c.uri)) {
                this.isError = true;
                return this.toJSON();
            }
            //output
            return (yield this.fromUrl(TokenResponse.response.data.response.parameters.uri));
        });
    }
}
exports.ValRsoAuth = ValRsoAuth;
//# sourceMappingURL=Auth.js.map