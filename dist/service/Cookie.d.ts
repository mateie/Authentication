import { type ValAuthEngine, type ValAuthData } from "../client/Engine";
declare class ValAuthCookie {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    });
    ReAuthorize(): Promise<ValAuthData>;
}
export { ValAuthCookie };
