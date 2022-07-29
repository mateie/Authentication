import { type ValAuthEngine } from "../client/Engine";
declare class ValAuthCookie {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthEngine.Json;
    });
    ReAuthorize(): Promise<ValAuthEngine.Json>;
}
export { ValAuthCookie };
