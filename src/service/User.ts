//import

import {
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_Ciphers,
    type ValAuthEngine, type ValAuthData
} from "../client/Engine";
import { ValAuthCore, type ValAuthRequestResponse } from "../client/Auth";

import { toUft8 } from "@valapi/lib";

import { CookieJar } from "tough-cookie";
import { HttpsCookieAgent, HttpCookieAgent } from "http-cookie-agent/http";

import axios, { type Axios, type AxiosRequestConfig, type AxiosResponse } from "axios";

//class

class ValAuthUser {
    private options: { config: ValAuthEngine.Options, data: ValAuthData };

    private cookie: CookieJar;
    private ValAuthAxios: Axios;

    public constructor(options: { config: ValAuthEngine.Options, data: ValAuthData }) {
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

        this.ValAuthAxios = axios.create({ ..._AxiosConfig, ...options.config.axiosConfig });
    }

    //auth

    public async LoginForm(username: string, password: string) {
        //cookie

        const CookieResponse: AxiosResponse = await this.ValAuthAxios.post('https://auth.riotgames.com/api/v1/authorization', {
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

        if (!CookieResponse.headers["set-cookie"]) {
            throw '<cookie> Cookie is undefined';
        }

        const asid_cookie = CookieResponse.headers["set-cookie"].find((element: string) => /^asid/.test(element));

        if (!asid_cookie) {
            throw '<asid> Cookie is undefined';
        }

        //token

        const TokenResponse: AxiosResponse<ValAuthRequestResponse> = await this.ValAuthAxios.put('https://auth.riotgames.com/api/v1/authorization', {
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

        return await (new ValAuthCore(this.options)).fromResponse(TokenResponse);
    }
}

//export

export {
    ValAuthUser
};