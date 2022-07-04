import { RsoEngine, type RsoOptions } from "./Engine";

import { RsoAuthUser } from "../service/User";
import { RsoAuthMultifactor } from "../service/Multifactor";
import { RsoAuthCookie } from "../service/Cookie";

class RsoClient extends RsoEngine {
    public constructor(options: RsoOptions = {}) {
        super(options);
    }

    //auth

    public async login(username: string, password: string) {
        const RsoUser = new RsoAuthUser({
            config: this.config,
            data: this.toJSON(),
        });

        const RsoLoginAuth = await RsoUser.LoginForm(username, password);

        this.fromJSON(RsoLoginAuth);
    }

    public async verify(verificationCode: number) {
        const RsoMultifactor = new RsoAuthMultifactor({
            config: this.config,
            data: this.toJSON(),
        });

        const RsoLoginAuth = await RsoMultifactor.TwoFactor(verificationCode);

        this.fromJSON(RsoLoginAuth);
    }

    public async load() {
        const RsoCookie = new RsoAuthCookie({
            config: this.config,
            data: this.toJSON(),
        });

        const RsoReAuth = await RsoCookie.ReAuth();
    }
}

export {
    RsoClient
};