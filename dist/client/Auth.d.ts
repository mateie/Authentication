import { ValAuthEngine, type ValAuthData } from "../client/Engine";
import { ValAuthAxios } from "../client/Axios";
declare type ValAuthRequestResponse = {
    type: "response";
    response: {
        mode: string;
        parameters: {
            uri: string;
        };
    };
    country: string;
} | {
    type: "multifactor";
    multifactor: {
        email: string;
        method: string;
        methods: Array<string>;
        multiFactorCodeLength: number;
        mfaVersion: string;
    };
    country: string;
    securityProfile: string;
};
declare class ValAuthCore extends ValAuthEngine {
    private options;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    });
    fromToken(token: string): Promise<void>;
    fromUrl(TokenUrl: string): Promise<ValAuthData>;
    fromResponse(TokenResponse: ValAuthAxios.Response<ValAuthRequestResponse>): Promise<ValAuthData>;
}
export { ValAuthCore };
export type { ValAuthRequestResponse };
