import { RsoEngine, type RsoOptions, type RsoAuthType } from "../client/Engine";
import { type RsoAxiosResponse } from "../client/Axios";
declare type RsoAuthResponse = {
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
declare class RsoAuthClient extends RsoEngine {
    private options;
    private RsoAxios;
    constructor(options: {
        config: RsoOptions;
        data: RsoAuthType;
    });
    fromUrl(TokenUrl: string): Promise<RsoAuthType>;
    fromResponse(TokenResponse: RsoAxiosResponse<RsoAuthResponse>): Promise<RsoAuthType>;
}
export { RsoAuthClient };
export type { RsoAuthResponse };
//# sourceMappingURL=Auth.d.ts.map