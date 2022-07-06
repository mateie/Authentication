import { type ValRsoEngine, type ValRsoAuthType } from "../client/Engine";
declare class ValRsoAuthCookie {
    private options;
    private cookie;
    private ValRsoAxios;
    constructor(options: {
        config: ValRsoEngine.Options;
        data: ValRsoAuthType;
    });
    ReAuth(): Promise<ValRsoAuthType>;
}
export { ValRsoAuthCookie };
//# sourceMappingURL=Cookie.d.ts.map