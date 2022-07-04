import { type RsoOptions, type RsoAuthType } from "../client/Engine";
declare class RsoAuthCookie {
    private options;
    private cookie;
    private RsoAxios;
    constructor(options: {
        config: RsoOptions;
        data: RsoAuthType;
    });
    ReAuth(): Promise<RsoAuthType>;
}
export { RsoAuthCookie };
//# sourceMappingURL=Cookie.d.ts.map