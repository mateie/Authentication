import { type ValAuthEngine, type ValAuthData } from "../client/Engine";
declare class ValAuthCookie {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    });
    ReAuth(): Promise<ValAuthData>;
}
export { ValAuthCookie };
