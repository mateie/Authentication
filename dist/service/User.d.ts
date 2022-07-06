import { type ValRsoEngine, type ValRsoAuthType } from "../client/Engine";
declare class ValRsoAuthUser {
    private options;
    private cookie;
    private ValRsoAxios;
    constructor(options: {
        config: ValRsoEngine.Options;
        data: ValRsoAuthType;
    });
    LoginForm(username: string, password: string): Promise<ValRsoAuthType>;
    Token(token: string): Promise<void>;
}
export { ValRsoAuthUser };
//# sourceMappingURL=User.d.ts.map