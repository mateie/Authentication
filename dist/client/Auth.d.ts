import { ValAuthEngine } from "./Engine";
import { type AxiosResponse } from "axios";
declare namespace ValAuthCore {
    type TokenResponse = {
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
}
declare class ValAuthCore extends ValAuthEngine {
    private options;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthEngine.Json;
    });
    private fromToken;
    fromUrl(TokenUrl: string): Promise<ValAuthEngine.Json>;
    fromResponse(TokenResponse: AxiosResponse<ValAuthCore.TokenResponse>): Promise<ValAuthEngine.Json>;
}
export { ValAuthCore };
