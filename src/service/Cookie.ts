import {
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_Ciphers,
    type ValAuthEngine, type ValAuthData
} from "../client/Engine";
import { ValAuthCore, type ValAuthRequestResponse } from "../client/Auth";

import toUft8 from "../utils/toUft8";

import { CookieJar } from "tough-cookie";
import { HttpsCookieAgent, HttpCookieAgent } from "http-cookie-agent/http";

import type { AxiosRequestConfig } from "axios";
import { ValAuthAxios } from "../client/Axios";

class ValAuthCookie {
    private options: { config: ValAuthEngine.Options, data: ValAuthData };

    private cookie: CookieJar;
    private ValAuthAxios: ValAuthAxios;

    public constructor(options: { config: ValAuthEngine.Options, data: ValAuthData }) {
        this.options = options;

        this.cookie = CookieJar.fromJSON(JSON.stringify(options.data.cookie.jar));
        const _AxiosConfig: AxiosRequestConfig = {
            headers: {
                Cookie: this.options.data.cookie.ssid,
                "X-Riot-ClientVersion": this.options.config.client?.version || CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": toUft8(JSON.stringify(this.options.config.client?.platform || CONFIG_ClientPlatform)),
            },
            httpsAgent: new HttpsCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true, ciphers: CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new HttpCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true }),
        };

        this.ValAuthAxios = new ValAuthAxios(new Object({ ..._AxiosConfig, ...options.config.axiosConfig }));
    }

    //auth

    public async ReAuth() {
        //token

        const TokenResponse: ValAuthAxios.Response<ValAuthRequestResponse> = await this.ValAuthAxios.post('https://auth.riotgames.com/api/v1/authorization', {
            client_id: "play-valorant-web-prod",
            nonce: 1,
            redirect_uri: "https://playvalorant.com/opt_in",
            response_mode: "query",
            response_type: "token id_token",
            scope: "account openid",
        }, {
            headers: {
                Cookie: this.options.data.cookie.ssid,
                'Content-Type': 'application/json',
            },
        });

        if (!TokenResponse.response.headers["set-cookie"]) {
            throw new Error(
                '<cookie> Cookie is undefined'
            );
        }

        const ssid_cookie = TokenResponse.response.headers["set-cookie"].find((element: string) => /^ssid/.test(element));

        if (!ssid_cookie) {
            throw new Error(
                '<ssid> Cookie is undefined'
            );
        }

        //auth

        this.options.data.cookie.ssid = ssid_cookie;

        return await (new ValAuthCore(this.options)).fromResponse(TokenResponse);
    }
}

export {
    ValAuthCookie
};