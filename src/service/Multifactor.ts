import {
    CONFIG_ClientPlatform, CONFIG_ClientVersion, CONFIG_Ciphers,
    type ValSoEngine, type ValSoAuthType
} from "../client/Engine";
import { ValSoAuth, type ValSoAuthResponse } from "../client/Auth";

import toUft8 from "../utils/toUft8";

import { CookieJar } from "tough-cookie";
import { HttpsCookieAgent, HttpCookieAgent } from "http-cookie-agent/http";

import type { AxiosRequestConfig } from "axios";
import { ValSoAxios } from "../client/Axios";

class ValSoAuthMultifactor {
    private options: { config: ValSoEngine.Options, data: ValSoAuthType };

    private cookie: CookieJar;
    private ValSoAxios: ValSoAxios;

    public constructor(options: { config: ValSoEngine.Options, data: ValSoAuthType }) {
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

        this.ValSoAxios = new ValSoAxios(new Object({ ..._AxiosConfig, ...options.config.axiosConfig }));
    }

    //auth

    public async TwoFactor(verificationCode: number) {
        //token
        
        const TokenResponse: ValSoAxios.Response<ValSoAuthResponse> = await this.ValSoAxios.put('https://auth.riotgames.com/api/v1/authorization', {
            "type": "multifactor",
            "code": String(verificationCode),
            "rememberDevice": true,
        });

        if (TokenResponse.isError === false) {
            this.options.data.multifactor = false;
        } else {
            this.options.data.isError = true;
        }

        //auth

        this.options.data.cookie.jar = this.cookie.toJSON();

        return await (new ValSoAuth(this.options)).fromResponse(TokenResponse);
    }
}

export {
    ValSoAuthMultifactor
};