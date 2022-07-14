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

class ValAuthMultifactor {
    private options: { config: ValAuthEngine.Options, data: ValAuthData };

    private cookie: CookieJar;
    private ValAuthAxios: Axios;

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

        this.ValAuthAxios = axios.create(new Object({ ..._AxiosConfig, ...options.config.axiosConfig }));
    }

    //auth

    public async TwoFactor(verificationCode: number) {
        //token
        
        const TokenResponse: AxiosResponse<ValAuthRequestResponse> = await this.ValAuthAxios.put('https://auth.riotgames.com/api/v1/authorization', {
            "type": "multifactor",
            "code": String(verificationCode),
            "rememberDevice": true,
        });

        if (TokenResponse.data.type === 'response') {
            this.options.data.multifactor = false;
        } else {
            this.options.data.isError = true;
        }

        //auth

        this.options.data.cookie.jar = this.cookie.toJSON();

        return await (new ValAuthCore(this.options)).fromResponse(TokenResponse);
    }
}

//export

export {
    ValAuthMultifactor
};