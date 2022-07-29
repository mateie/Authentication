import { type ValAuthEngine } from "../client/Engine";
declare class ValAuthUser {
    private options;
    private cookie;
    private ValAuthAxios;
    constructor(options: {
        config: ValAuthEngine.Options;
        data: ValAuthEngine.Json;
    });
    LoginForm(username: string, password: string): Promise<ValAuthEngine.Json>;
}
export { ValAuthUser };
