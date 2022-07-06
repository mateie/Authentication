import { ValRsoEngine, type ValRsoAuthType } from "../client/Engine";
import { ValRsoAxios } from "../client/Axios";
declare type ValRsoAuthResponse = {
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
declare class ValRsoAuth extends ValRsoEngine {
    private options;
    private ValRsoAxios;
    constructor(options: {
        config: ValRsoEngine.Options;
        data: ValRsoAuthType;
    });
    fromUrl(TokenUrl: string): Promise<ValRsoAuthType>;
    fromResponse(TokenResponse: ValRsoAxios.Response<ValRsoAuthResponse>): Promise<ValRsoAuthType>;
}
export { ValRsoAuth };
export type { ValRsoAuthResponse };
//# sourceMappingURL=Auth.d.ts.map