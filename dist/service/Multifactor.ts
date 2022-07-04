//import

import { CookieJar } from 'tough-cookie';
import { RsoAuthRequestResponse } from '../client/Axios';

import { RsoAuthEngine } from '../client/Engine';

import type { RsoAuth, RsoAuthExtend } from './User';
import { RsoAuthFlow } from "./AuthFlow";

//class

class RsoMultifactorAuth {
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
    };
    public multifactor:boolean;
    public isError:boolean;
    
    /**
     * Class Constructor
     * @param {RsoAuth} data Account toJSON data
     */
    public constructor(data: RsoAuth) {
        if(!data.multifactor){
            throw new Error('This Account is not have a Multifactor');
        }

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
    * @param {Number} verificationCode Verification Code
    * @param {RsoAuthExtend} extendsData Extradata of auth
    * @returns {Promise<RsoAuth>}
    */
    public async execute(verificationCode:number, extendsData:RsoAuthExtend):Promise<RsoAuth> {
        const RequestClient = RsoAuthEngine.RequestClientCookie(extendsData);
        
        //ACCESS TOKEN
        const auth_response:RsoAuthRequestResponse<any> = await RequestClient.put('https://auth.riotgames.com/api/v1/authorization', {
            "type": "multifactor",
            "code": String(verificationCode),
            "rememberDevice": true
        });

        if(!auth_response.isError){
            this.multifactor = false;
        }

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
     * @param {RsoAuth} data ValAuth_Account toJSON data
     * @param {Number} verificationCode Verification Code
     * @param {RsoAuthExtend} extendsData Extradata of auth
     * @returns {Promise<RsoAuth>}
     */
     public static async verify(data:RsoAuth, verificationCode:number, extendsData:RsoAuthExtend):Promise<RsoAuth> {
        const MultifactorAccount:RsoMultifactorAuth = new RsoMultifactorAuth(data);
    
        try {
            return await MultifactorAccount.execute(verificationCode, extendsData);
        } catch (error) {
            MultifactorAccount.isError = true;

            return MultifactorAccount.toJSON();
        }
    }
}

//export
export { RsoMultifactorAuth };