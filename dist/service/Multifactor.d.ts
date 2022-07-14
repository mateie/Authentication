import { type ValAuthEngine, type ValAuthData } from "../client/Engine";
declare class ValAuthMultifactor {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    });
    TwoFactor(verificationCode: number): Promise<ValAuthData>;
}
export { ValAuthMultifactor };
