import { type ValRsoEngine, type ValRsoAuthType } from "../client/Engine";
declare class ValRsoAuthMultifactor {
    private options;
    private cookie;
    private ValRsoAxios;
    constructor(options: {
        config: ValRsoEngine.Options;
        data: ValRsoAuthType;
    });
    TwoFactor(verificationCode: number): Promise<ValRsoAuthType>;
}
export { ValRsoAuthMultifactor };
//# sourceMappingURL=Multifactor.d.ts.map