//import

import {
    ValAuth
} from "./client/Client";

//export

export {
    ValAuth as Client,
};

export { ValAuthEngine } from "./client/Engine";

export { ValAuthUser } from "./service/User";
export { ValAuthMultifactor } from "./service/Multifactor";
export { ValAuthCookie } from "./service/Cookie";

export default ValAuth;