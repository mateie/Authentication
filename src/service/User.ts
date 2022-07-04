import {
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_Ciphers,
    type RsoOptions, type RsoAuthType
} from "../client/Engine";
import { RsoAuthClient, type RsoAuthResponse } from "../client/Auth";

import toUft8 from "../utils/toUft8";

import { CookieJar } from "tough-cookie";
import { HttpsCookieAgent, HttpCookieAgent } from "http-cookie-agent/http";

import type { AxiosRequestConfig } from "axios";
import { RsoAxios, type RsoAxiosResponse } from "../client/Axios";

class RsoAuthUser {
    private options: { config: RsoOptions, data: RsoAuthType };
    
    private cookie: CookieJar;
    private RsoAxios: RsoAxios;

    public constructor(options: { config: RsoOptions, data: RsoAuthType }) {
        this.options = options;

        this.cookie = CookieJar.fromJSON(JSON.stringify(options.data.cookie.jar));
        const _AxiosConfig: AxiosRequestConfig = {
            headers: {
                "X-Riot-ClientVersion": this.options.config.client?.version || CONFIG_ClientVersion,
                "X-Riot-ClientPlatform": toUft8(JSON.stringify(this.options.config.client?.platform || CONFIG_ClientPlatform)),
            },
            httpsAgent: new HttpsCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true, ciphers: CONFIG_Ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new HttpCookieAgent({ cookies: { jar: this.cookie }, keepAlive: true }),
        };

        this.RsoAxios = new RsoAxios(new Object({ ..._AxiosConfig, ...options.config.axiosConfig }));
    }

    //auth

    public async LoginForm(username: string, password: string) {
        //cookie

        const CookieResponse: RsoAxiosResponse = await this.RsoAxios.post('https://auth.riotgames.com/api/v1/authorization', {
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
            throw new Error(
                '<cookie> Cookie is undefined'
            );
        }

        const asid_cookie = CookieResponse.response.headers["set-cookie"].find((element: string) => /^asid/.test(element));

        if (!asid_cookie) {
            throw new Error(
                '<asid> Cookie is undefined'
            );
        }

        //token

        const TokenResponse: RsoAxiosResponse<RsoAuthResponse> = await this.RsoAxios.put('https://auth.riotgames.com/api/v1/authorization', {
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

        return await (new RsoAuthClient(this.options)).fromResponse(TokenResponse);
    }

    public async Token(token: string) {
        throw new Error(
            'In-Dev coming soon...'
        );
    }
}

export {
    RsoAuthUser
};