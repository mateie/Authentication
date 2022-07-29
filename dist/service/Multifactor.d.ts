import { type ValAuthEngine } from "../client/Engine";
declare class ValAuthMultifactor {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthEngine.Json;
    });
    TwoFactor(verificationCode: number): Promise<ValAuthEngine.Json>;
}
export { ValAuthMultifactor };
