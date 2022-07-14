import { type ValAuthEngine, type ValAuthData } from "../client/Engine";
declare class ValAuthUser {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthData;
    });
    LoginForm(username: string, password: string): Promise<ValAuthData>;
}
export { ValAuthUser };
