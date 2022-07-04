import type { CookieJar } from 'tough-cookie';
import { 
    HttpsCookieAgent, HttpCookieAgent, 
} from 'http-cookie-agent/http';

import { RsoRequestClient } from './Axios';
import type { AxiosRequestConfig } from 'axios';
import toUft8 from '../../src/utils/toUft8';

import type { RsoAuthExtend } from '../service/User';

const RsoAuth_ciphers: Array<string> = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
];
const RsoAuth_UserAgent = `RiotClient/43.0.1.41953 86.4190634 rso-auth (Windows; 10;;Professional, x64)`;

class RsoAuthEngine {
    public static RequestCookieConfig(cookie: { jar: CookieJar, ssid: string }, client: { version: string, platform: string }): AxiosRequestConfig {
        return {
            headers: {
                Cookie: `${cookie.ssid}`,
                "User-Agent": `${RsoAuth_UserAgent}`,
                "X-Riot-ClientVersion": String(client.version),
                "X-Riot-ClientPlatform": toUft8(JSON.stringify(client.platform)),
            },
            httpAgent: new HttpCookieAgent({ cookies: { jar: cookie.jar }, keepAlive: true }),
            httpsAgent: new HttpsCookieAgent({ cookies: { jar: cookie.jar }, keepAlive: true, ciphers: RsoAuth_ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.3' }),
        };
    }

    public static RequestClientCookie(extendsData: RsoAuthExtend): RsoRequestClient {
        const _Config = RsoAuthEngine.RequestCookieConfig(extendsData.cookie, extendsData.client);

        return new RsoRequestClient(_Config);
    }
}

export {
    RsoAuthEngine,
};