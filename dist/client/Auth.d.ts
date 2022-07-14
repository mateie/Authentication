import { ValAuthEngine, type ValAuthData } from "../client/Engine";
import { type AxiosResponse } from "axios";
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
} | {
    type: "auth";
    error: string;
    country: string;
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
    fromResponse(TokenResponse: AxiosResponse<ValAuthRequestResponse>): Promise<ValAuthData>;
}
export { ValAuthCore };
export type { ValAuthRequestResponse };
