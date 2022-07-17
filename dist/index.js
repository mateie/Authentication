"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ValAuthEngine = void 0;
const Engine_1 = require("./client/Engine");
Object.defineProperty(exports, "ValAuthEngine", { enumerable: true, get: function () { return Engine_1.ValAuthEngine; } });
const Client_1 = require("./client/Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.ValAuth; } });
exports.default = Client_1.ValAuth;
