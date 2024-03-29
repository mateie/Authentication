"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAuthCore = void 0;
const tslib_1 = require("tslib");
const Engine_1 = require("./Engine");
const lib_1 = require("@valapi/lib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const http_1 = require("http-cookie-agent/http");
//class
class ValAuthCore extends Engine_1.ValAuthEngine {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        super();
        this.build(options);
        this.options = options;
        //axios
        let HttpsConfig = { cookies: { jar: this.cookie.jar }, keepAlive: true, ciphers: Engine_1.CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' };
        let HttpConfig = { cookies: { jar: this.cookie.jar }, keepAlive: true };
        if (((_a = options.config.axiosConfig) === null || _a === void 0 ? void 0 : _a.proxy) && typeof ((_b = options.config.axiosConfig) === null || _b === void 0 ? void 0 : _b.proxy) !== 'boolean') {
            HttpsConfig = Object.assign(Object.assign({}, HttpsConfig), { port: (_d = (_c = options.config.axiosConfig) === null || _c === void 0 ? void 0 : _c.proxy) === null || _d === void 0 ? void 0 : _d.port, host: (_f = (_e = options.config.axiosConfig) === null || _e === void 0 ? void 0 : _e.proxy) === null || _f === void 0 ? void 0 : _f.host });
            HttpConfig = Object.assign(Object.assign({}, HttpConfig), { port: (_h = (_g = options.config.axiosConfig) === null || _g === void 0 ? void 0 : _g.proxy) === null || _h === void 0 ? void 0 : _h.port, host: (_k = (_j = options.config.axiosConfig) === null || _j === void 0 ? void 0 : _j.proxy) === null || _k === void 0 ? void 0 : _k.host });
        }
        this.ValAuthAxios = axios_1.default.create(Object.assign({
            headers: {
                Cookie: this.cookie.ssid,
                "User-Agent": Engine_1.CONFIG_UserAgent,
                "X-Riot-ClientVersion": ((_l = this.config.client) === null || _l === void 0 ? void 0 : _l.version) || Engine_1.CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": (0, lib_1.toUft8)(JSON.stringify(((_m = this.config.client) === null || _m === void 0 ? void 0 : _m.platform) || Engine_1.CONFIG_ClientPlatform)),
            },
            httpsAgent: new http_1.HttpsCookieAgent(HttpsConfig),
            httpAgent: new http_1.HttpCookieAgent(HttpConfig),
        }, options.config.axiosConfig));
    }
    //auth
    fromToken(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.access_token = token;
            //ENTITLEMENTS
            const EntitlementsResponse = yield this.ValAuthAxios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
                headers: {
                    'Authorization': `${this.token_type || 'Bearer'} ${this.access_token}`,
                },
            });
            if (EntitlementsResponse.data.entitlements_token) {
                this.entitlements_token = EntitlementsResponse.data.entitlements_token;
            }
        });
    }
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
            this.id_token = new URLSearchParams(Search_path).get('id_token') || '';
            this.expires_in = Number(new URLSearchParams(Search_path).get('expires_in') || 3600);
            this.token_type = new URLSearchParams(Search_path).get('token_type') || 'Bearer';
            this.session_state = new URLSearchParams(Search_path).get('session_state') || '';
            yield this.fromToken(this.access_token);
            //REGION
            if (this.id_token) {
                const RegionResponse = yield this.ValAuthAxios.put('https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant', {
                    id_token: this.id_token,
                }, {
                    headers: {
                        'Authorization': `${this.token_type || 'Bearer'} ${this.access_token}`,
                        'X-Riot-Entitlements-JWT': this.entitlements_token,
                    }
                });
                this.region.pbe = ((_b = (_a = RegionResponse.data) === null || _a === void 0 ? void 0 : _a.affinities) === null || _b === void 0 ? void 0 : _b.pbe) || 'na';
                this.region.live = ((_d = (_c = RegionResponse.data) === null || _c === void 0 ? void 0 : _c.affinities) === null || _d === void 0 ? void 0 : _d.live) || 'na';
            }
            //output
            return this.toJSON();
        });
    }
    fromResponse(TokenResponse) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!TokenResponse.data || !TokenResponse.data.type) {
                this.isError = true;
                return this.toJSON();
            }
            //MFA
            if (TokenResponse.data.type && TokenResponse.data.type == 'multifactor') {
                this.isMultifactor = true;
                return this.toJSON();
            }
            else {
                this.isMultifactor = false;
            }
            //COOKIE
            if (!TokenResponse.headers["set-cookie"]) {
                throw '<cookie> Cookie is undefined';
            }
            const ssid_cookie = TokenResponse.headers["set-cookie"].find((element) => /^ssid/.test(element));
            if (!ssid_cookie) {
                throw '<asid> Cookie is undefined';
            }
            this.cookie.ssid = ssid_cookie;
            //URL
            if (TokenResponse.data.type !== 'response' || !TokenResponse.data.response) {
                this.isError = true;
                return this.toJSON();
            }
            //output
            return (yield this.fromUrl(TokenResponse.data.response.parameters.uri));
        });
    }
}
exports.ValAuthCore = ValAuthCore;
