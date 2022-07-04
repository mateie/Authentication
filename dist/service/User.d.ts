import { type RsoOptions, type RsoAuthType } from "../client/Engine";
declare class RsoAuthUser {
    private options;
    private cookie;
    private RsoAxios;
    constructor(options: {
        config: RsoOptions;
        data: RsoAuthType;
    });
    LoginForm(username: string, password: string): Promise<RsoAuthType>;
    Token(token: string): Promise<void>;
}
export { RsoAuthUser };
//# sourceMappingURL=User.d.ts.map