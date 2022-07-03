//import
import { EventEmitter } from 'events';

import { CookieJar } from "tough-cookie";
import type { AxiosRequestConfig } from "axios";
import { HttpsCookieAgent, HttpCookieAgent } from "http-cookie-agent/http";

import { 
    RsoRequestClient,
    type RsoAuthError, type RsoAuthRequestEventData
} from './Axios';

import toUft8 from '../utils/toUft8';

// auth type

import { Account as ClientAuthAccount, type RsoAuthAuth, type RsoAuthAuthExtend } from "../service/Account";
import { Multifactor as ClientAuthMultifactor } from "../service/Multifactor";
import { CookieAuth as ClientAuthCookie } from "../service/CookieAuth";

//interface

interface RsoAuthClient {
    cookie: string;
    access_token: string;
    id_token?: string;
    token_type?: string;
    entitlements_token: string;
    region: {
        pbe: string,
        live: string,
    };
    createAt: {
        cookie: number,
        token: number,
    };
}

interface RsoAuthClientPlatfrom {
    "platformType": string;
    "platformOS": string;
    "platformOSVersion": string;
    "platformChipset": string;
}

interface RsoAuthConfig {
    client?: {
        version?: string,
        platform?: RsoAuthClientPlatfrom,
    };
    forceAuth?: boolean;
    axiosConfig?: AxiosRequestConfig;
    expiresIn?: {
        cookie: number,
        token?: number,
    };
    selfAuthentication?: {
        username: string | Function,
        password: string | Function,
        verifyCode?: string | number | Function,
    };
}

const _Client_Version = 'release-05.00-shipping-6-725355';
const _Client_Platfrom = {
    "platformType": "PC",
    "platformOS": "Windows",
    "platformOSVersion": "10.0.19042.1.256.64bit",
    "platformChipset": "Unknown",
};

const _defaultConfig: RsoAuthConfig = {
    client: {
        version: _Client_Version,
        platform: _Client_Platfrom,
    },
    forceAuth: false,
    axiosConfig: {
        headers: {
            'User-Agent': 'RiotClient/43.0.1.41953 86.4190634 rso-auth (Windows; 10;;Professional, x64)'
        },
    },
    expiresIn: { //Milliseconds
        cookie: 2592000000,
        token: 3600000,
    },
};

//event

interface RsoAuthEventExpire {
    'cookie': CookieJar;
    'token': string;
}

interface RsoAuthEventSettings {
    'region': string;
    'client_version': string;
    'client_platfrom': RsoAuthClientPlatfrom;
    'cookie': CookieJar.Serialized;
}

interface RsoAuthClientEvent {
    'ready': () => void;
    'expires': <ExpireName extends keyof RsoAuthEventExpire>(data: { name: ExpireName, data: RsoAuthEventExpire[ExpireName] }) => void;
    'request': (data: RsoAuthRequestEventData) => void;
    'changeSettings': <SettingName extends keyof RsoAuthEventSettings>(data: { name: SettingName, data: RsoAuthEventSettings[SettingName] }) => void;
    'error': (data: RsoAuthError) => void;
}

declare interface EventEmitter {
    emit<EventName extends keyof RsoAuthClientEvent>(name: EventName, ...args: Parameters<RsoAuthClientEvent[EventName]>): void;
    on<EventName extends keyof RsoAuthClientEvent>(name: EventName, callback: RsoAuthClientEvent[EventName]): void;
    once<EventName extends keyof RsoAuthClientEvent>(name: EventName, callback: RsoAuthClientEvent[EventName]): void;
    off<EventName extends keyof RsoAuthClientEvent>(name: EventName, callback?: RsoAuthClientEvent[EventName]): void;
}

//class

class RsoClient extends EventEmitter {
    public reloadTimes: number = 0;
    public reconnectTimes: number = 0;

    //auth
    private cookie: {
        jar: CookieJar,
        ssid: string,
    };
    private access_token: string;
    private id_token: string;
    private expires_in: number;
    private token_type: string;
    private entitlements_token: string;
    public multifactor: boolean;
    public isError: boolean;

    private region: {
        pbe: string,
        live: string,
    };

    //custom

    public createAt: {
        cookie: number,
        token: number,
    };
    
    protected config: RsoAuthConfig;

    //reload
    private axiosConfig: AxiosRequestConfig;
    private RequestClient: RsoRequestClient;

    /**
     * Create a new Valorant API Wrapper Client
     * @param {RsoAuthConfig} config Client Config
     */
    public constructor(config: RsoAuthConfig = {}) {
        super();

        //config
        this.config = new Object({ ..._defaultConfig, ...config });

        //create without auth
        this.cookie = {
            jar: new CookieJar(),
            ssid: '',
        };
        this.access_token = '';
        this.id_token = '';
        this.expires_in = 3600;
        this.token_type = 'Bearer';
        this.entitlements_token = '';
        this.region = {
            pbe: 'na',
            live: 'na',
        };
        this.multifactor = false;
        this.isError = false;

        this.createAt = {
            cookie: new Date().getTime(),
            token: new Date().getTime(),
        };

        // first reload

        //request client
        const ciphers: Array<string> = [
            'TLS_CHACHA20_POLY1305_SHA256',
            'TLS_AES_128_GCM_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
        ];
        const _normalAxiosConfig: AxiosRequestConfig = {
            headers: {
                'Authorization': `${this.token_type} ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': String(this.config.client?.version),
                'X-Riot-ClientPlatform': toUft8(JSON.stringify(this.config.client?.platform)),
            },
            httpsAgent: new HttpsCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true, ciphers: ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new HttpCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true }),
        };
        this.axiosConfig = new Object({ ..._normalAxiosConfig, ...this.config.axiosConfig });
        this.RequestClient = new RsoRequestClient(this.axiosConfig);
        this.RequestClient.on('error', ((data: RsoAuthError) => { this.emit('error', data as RsoAuthError); }));
        this.RequestClient.on('request', ((data: RsoAuthRequestEventData) => { this.emit('request', data as RsoAuthRequestEventData); }));

        //event
        this.emit('ready');
    }

    //reload

    /**
     * Reload Class
     * @returns {void}
     */
    private reload(): void {
        this.reloadTimes + 1;

        //request client
        const ciphers: Array<string> = [
            'TLS_CHACHA20_POLY1305_SHA256',
            'TLS_AES_128_GCM_SHA256',
            'TLS_AES_256_GCM_SHA384',
            'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
        ];
        const _normalAxiosConfig: AxiosRequestConfig = {
            headers: {
                'Authorization': `${this.token_type} ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': String(this.config.client?.version),
                'X-Riot-ClientPlatform': toUft8(JSON.stringify(this.config.client?.platform)),
            },
            httpsAgent: new HttpsCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true, ciphers: ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
            httpAgent: new HttpCookieAgent({ cookies: { jar: this.cookie.jar }, keepAlive: true }),
        };
        this.axiosConfig = new Object({ ..._normalAxiosConfig, ...this.config.axiosConfig });
        this.RequestClient = new RsoRequestClient(this.axiosConfig);
        this.RequestClient.on('error', ((data: RsoAuthError) => { this.emit('error', data as RsoAuthError); }));
        this.RequestClient.on('request', ((data: RsoAuthRequestEventData) => { this.emit('request', data as RsoAuthRequestEventData); }));

        //event
        this.emit('ready');
    }

    /**
     * Reconnect to the server
     * @param {Boolean} force Force to reconnect
     */
    public async reconnect(force?: Boolean): Promise<void> {
        if ((new Date().getTime()) >= (this.createAt.cookie + Number(this.config.expiresIn?.cookie))) {
            //event
            this.emit('expires', {
                name: 'cookie',
                data: this.cookie,
            });
            this.cookie = {
                jar: new CookieJar(),
                ssid: '',
            }
            //uptodate
            if (this.config.expiresIn && this.config.expiresIn.cookie <= 0) {
                this.config.expiresIn.cookie = _defaultConfig.expiresIn?.cookie as number;
            }
            this.createAt = {
                cookie: new Date().getTime(),
                token: new Date().getTime(),
            };
            //auto
            if (this.config.selfAuthentication) {
                await this.login(this.config.selfAuthentication.username, this.config.selfAuthentication.password);
                this.reconnectTimes + 1;

                if (this.multifactor && this.config.selfAuthentication.verifyCode) {
                    await this.verify(this.config.selfAuthentication.verifyCode);
                } else if (this.multifactor) {
                    this.emit('error', {
                        errorCode: 'RsoAuth_Authentication_Error',
                        message: 'Missing verifyCode at autoAuthentication',
                        data: this.config.selfAuthentication,
                    });
                }
            } else if (!this.config.forceAuth) {
                this.emit('error', {
                    errorCode: 'RsoAuth_Expired_Cookie',
                    message: 'Cookie Expired',
                    data: this.createAt.cookie,
                });
            }
        }

        if ((new Date().getTime()) >= (this.createAt.token + Number(this.config.expiresIn?.token)) || force === true) {
            //event
            this.emit('expires', {
                name: 'token',
                data: this.access_token,
            });
            this.access_token = '';
            //uptodate
            if (this.config.expiresIn && Number(this.config.expiresIn.token) <= 0) {
                this.config.expiresIn.token = _defaultConfig.expiresIn?.token as number;
            }
            this.createAt.token = new Date().getTime();
            //auto
            // await this.fromCookie(); //
            this.reconnectTimes + 1;
        }
    }

    //save

    /**
     * 
     * @returns {RsoAuthClient}
     */
    public toJSON(): RsoAuthClient {
        return {
            cookie: this.cookie.ssid,
            access_token: this.access_token,
            id_token: this.id_token,
            token_type: this.token_type,
            entitlements_token: this.entitlements_token,
            region: this.region,
            createAt: this.createAt,
        };
    }

    /**
     * 
     * @param {RsoAuthClient} data Client `.toJSON()` data
     * @returns {void}
     */
    public fromJSON(data: RsoAuthClient): void {
        if (!data.id_token) {
            data.id_token = '';
        }

        if (!data.token_type) {
            data.token_type = 'Bearer';
        }

        this.cookie.ssid = data.cookie;
        this.access_token = data.access_token;
        this.id_token = data.id_token;
        this.token_type = data.token_type;
        this.entitlements_token = data.entitlements_token;
        this.region = data.region;
        this.createAt = data.createAt;

        this.reload();
    }

    //auth

    /**
     * 
     * @returns {RsoAuthAuth}
     */
    public toJSONAuth(): RsoAuthAuth {
        return {
            cookie: this.cookie.jar.toJSON(),
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
     * 
     * @param {RsoAuthAuth} auth Authentication Data
     * @returns {void}
     */
    public fromJSONAuth(auth: RsoAuthAuth): void {
        this.cookie.jar = CookieJar.fromJSON(JSON.stringify(auth.cookie));
        this.access_token = auth.access_token;
        this.id_token = auth.id_token;
        this.expires_in = auth.expires_in || Number(3600);
        this.token_type = auth.token_type;
        this.entitlements_token = auth.entitlements_token;
        this.region = auth.region;

        if (!this.region.live) {
            this.region.live = 'na';
        }

        this.multifactor = auth.multifactor || Boolean(false);
        this.isError = auth.isError || Boolean(false);

        if (auth.isError && !this.config.forceAuth) {
            this.emit('error', {
                errorCode: 'RsoAuth_Authentication_Error',
                message: 'Authentication Error',
                data: auth,
            });
        }

        this.createAt = {
            cookie: new Date().getTime(),
            token: new Date().getTime(),
        };

        this.reload();
    }

    /**
     * Login to Riot Account
     * @param {String} username Username
     * @param {String} password Password
     * @returns {Promise<void>}
     */
    public async login(username: string | Function, password: string | Function): Promise<void> {
        if (typeof username === 'function') {
            username = (await username()) as string;
        }

        if (typeof password === 'function') {
            password = (await password()) as string;
        }

        const _extraData: RsoAuthAuthExtend = {
            client: {
                version: String(this.config.client?.version),
                platform: toUft8(JSON.stringify(this.config.client?.platform)),
            },
            cookie: this.cookie,
        };
        const NewAuth: RsoAuthAuth = await ClientAuthAccount.login(this.toJSONAuth(), username, password, _extraData);

        this.fromJSONAuth(NewAuth);

        if (this.multifactor) {
            if (this.config.selfAuthentication && !this.config.selfAuthentication?.verifyCode) {
                throw new Error(
                    'Multifactor is not supported when selfAuthentication.verifyCode is not set',
                );
            }
        }
    }

    /**
     * Multi-Factor Authentication
     * @param {number} verificationCode Verification Code
     * @returns {Promise<void>}
     */
    public async verify(verificationCode: number | string | Function): Promise<void> {
        if (typeof verificationCode === 'function') {
            verificationCode = (await verificationCode()) as number | string;
        }

        const _extraData: RsoAuthAuthExtend = {
            client: {
                version: String(this.config.client?.version),
                platform: toUft8(JSON.stringify(this.config.client?.platform)),
            },
            cookie: this.cookie,
        };
        const NewAuth: RsoAuthAuth = await ClientAuthMultifactor.verify(this.toJSONAuth(), Number(verificationCode), _extraData);

        this.fromJSONAuth(NewAuth);
    }

    //settings

    /**
     * @param {String} clientVersion Client Version
     * @returns {void}
     */
    public setClientVersion(clientVersion: string = _Client_Version): void {
        this.emit('changeSettings', { name: 'client_version', data: clientVersion });

        this.config.client = {
            version: clientVersion,
            platform: this.config.client?.platform,
        };
        this.reload();
    }

    /**
     * @param {RsoAuthClientPlatfrom} clientPlatfrom Client Platfrom in json
     * @returns {void}
     */
    public setClientPlatfrom(clientPlatfrom: RsoAuthClientPlatfrom = _Client_Platfrom): void {
        this.emit('changeSettings', { name: 'client_platfrom', data: clientPlatfrom });

        this.config.client = {
            version: this.config.client?.version,
            platform: clientPlatfrom,
        };
        this.reload();
    }

    /**
     * @param {CookieJar.Serialized} cookie Cookie
     * @returns {void}
     */
    public setCookie(cookie: CookieJar.Serialized): void {
        this.emit('changeSettings', { name: 'cookie', data: cookie });

        this.cookie.jar = CookieJar.fromJSON(JSON.stringify(cookie));
        this.reload();
    }

    //static

    /**
     * * Something went wrong? try to not use static methods.
     * @param {RsoAuthConfig} config Client Config
     * @param {RsoAuthClient} data Client `.toJSON()` data
     * @returns {RsoClient}
     */
    public static fromJSON(config: RsoAuthConfig, data: RsoAuthClient): RsoClient {
        const NewClient: RsoClient = new RsoClient(config);
        NewClient.fromJSON(data);

        NewClient.reconnectTimes = 1;

        return NewClient;
    }
}

//export
export { RsoClient };
export type { RsoAuthClient, RsoAuthClientPlatfrom, RsoAuthConfig, RsoAuthEventExpire, RsoAuthEventSettings, RsoAuthClientEvent };