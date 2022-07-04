//import

import { CookieJar } from 'tough-cookie';
import type { RsoAuthRequestResponse } from '../client/Axios';

import { RsoAuthEngine } from '../client/Engine';

import { RsoAuthFlow } from "./AuthFlow";

//interface

interface RsoAuthExtend {
    client: {
        version: string,
        platform: string,
    };
    cookie: {
        jar: CookieJar,
        ssid: string,
    };
}

//class

class RsoUserAuth {
    private cookie: {
        jar: CookieJar,
        ssid: string,
    };
    private access_token:string;
    private id_token:string;
    private expires_in:number;
    private token_type:string;
    private entitlements_token:string;
    private region: {
        pbe: string,
        live: string,
    }
    public multifactor:boolean;
    public isError:boolean;
    
    /**
     * Class Constructor
     * @param {RsoAuth} data Authentication Data 
     */
    public constructor(data: RsoAuth) {
        this.cookie = {
            jar: CookieJar.fromJSON(JSON.stringify(data.cookie.jar)),
            ssid: data.cookie.ssid,
        };
        this.access_token = data.access_token;
        this.id_token = data.id_token;
        this.expires_in = data.expires_in;
        this.token_type = data.token_type;
        this.entitlements_token = data.entitlements_token;
        this.region = data.region;
        this.multifactor = data.multifactor;
        this.isError = data.isError;
    }

    /**
     * @param {String} username Riot Account Username (not email)
     * @param {String} password Riot Account Password
     * @param {RsoAuthExtend} extendsData Extradata of auth
     * @returns {Promise<RsoAuth>}
     */
     public async execute(username:string, password:string, extendsData:RsoAuthExtend):Promise<RsoAuth> {
        const RequestClient = RsoAuthEngine.RequestClientCookie(extendsData);

        await RequestClient.post('https://auth.riotgames.com/api/v1/authorization', {
            "client_id": "play-valorant-web-prod",
            "nonce": "1",
            "redirect_uri": "https://playvalorant.com/opt_in",
            "response_mode": "query",
            "response_type": "token id_token",
            "scope": "account openid"
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.cookie.jar = new CookieJar(RequestClient.theAxios.defaults.httpsAgent.jar?.store, {
            rejectPublicSuffixes: RequestClient.theAxios.defaults.httpsAgent.options?.jar?.rejectPublicSuffixes || undefined,
        });

        //ACCESS TOKEN
        const auth_response:RsoAuthRequestResponse<any> = await RequestClient.put('https://auth.riotgames.com/api/v1/authorization', {
            'type': 'auth',
            'username': String(username),
            'password': String(password),
            'remember': true,
        });

        this.cookie.jar = new CookieJar(RequestClient.theAxios.defaults.httpsAgent.jar?.store, {
            rejectPublicSuffixes: RequestClient.theAxios.defaults.httpsAgent.options?.jar?.rejectPublicSuffixes || undefined,
        });
        return await RsoAuthFlow.execute(this.toJSON(), auth_response, extendsData);
    }

    /**
     * 
     * @returns {RsoAuth}
     */
     public toJSON():RsoAuth {
        return {
            cookie: {
                jar: this.cookie.jar.toJSON(),
                ssid: this.cookie.ssid,
            },
            access_token: this.access_token,
            id_token: this.id_token,
            expires_in: this.expires_in,
            token_type: this.token_type,
            entitlements_token: this.entitlements_token,
            region: this.region,
            multifactor: this.multifactor,
            isError: this.isError,
        };
    }

    /**
     * @param {RsoAuth} data Authentication Data
     * @param {String} username Riot Account Username
     * @param {String} password Riot Account Password
     * @param {RsoAuthExtend} extendsData Extradata of auth
     * @returns {Promise<RsoAuth>}
     */
     public static async login(data:RsoAuth, username:string, password:string, extendsData:RsoAuthExtend):Promise<RsoAuth> {
        const NewAccount:RsoUserAuth = new RsoUserAuth(data);

        try {
            return await NewAccount.execute(username, password, extendsData);
        } catch (error) {
            NewAccount.isError = true;

            return NewAccount.toJSON();
        }
    }
}

//export
export { RsoUserAuth };
export type { RsoAuthExtend };