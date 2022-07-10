import { ValSoAuth } from "../client/Auth";

import { ValSoAxios } from "../client/Axios";

interface ValRsoConfig {
    token: string;
    client: {
        id: string,
        secret: string,
    };
}

interface ValRsoResponse {
    scope: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    access_token: string;
}

/**
 * Riot Sign On
 */
class ValRso {
    public config: ValRsoConfig;

    private ValSoAxios: ValSoAxios;

    protected access_token: string;
    protected expires_in: number;
    protected token_type: string;

    /**
     * Create a new ValRso Client
     * @param {ValRsoConfig} options Client Config
     */
    public constructor(options: ValRsoConfig) {
        this.config = options;
        this.ValSoAxios = new ValSoAxios();

        this.access_token = '';
        this.expires_in = 600;
        this.token_type = 'Bearer';
    }

    //auth

    public async reload() {
        const _UrlBody = new URLSearchParams();
        _UrlBody.append('grant_type', "refresh_token");
        _UrlBody.append('refresh_token', this.config.token);

        const RsoResponse: ValSoAxios.Response<ValRsoResponse> = await this.ValSoAxios.post('https://auth.riotgames.com/token', _UrlBody, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${this.config.client.id}:${this.config.client.secret}`).toString("base64")}`
            },
        });

        this.access_token = RsoResponse.response.data.access_token;
        this.expires_in = RsoResponse.response.data.expires_in;
        this.token_type = RsoResponse.response.data.token_type;
    }
}

//export

export {
    ValRso
};