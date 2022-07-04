import { type RsoOptions, type RsoAuthType } from "../client/Engine";
declare class RsoAuthMultifactor {
    private options;
    private cookie;
    private RsoAxios;
    constructor(options: {
        config: RsoOptions;
        data: RsoAuthType;
    });
    TwoFactor(verificationCode: number): Promise<RsoAuthType>;
}
export { RsoAuthMultifactor };
//# sourceMappingURL=Multifactor.d.ts.map