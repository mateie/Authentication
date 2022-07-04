"use strict";
//import
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsoAxios = void 0;
const events_1 = require("events");
const axios_1 = __importDefault(require("axios"));
//class
class RsoAxios extends events_1.EventEmitter {
    /**
     * Class Constructor
     * @param {AxiosRequestConfig} config Config
     */
    constructor(config = {}) {
        super();
        if (config.timeout && isNaN(config.timeout)) {
            config.timeout = 60000; // 1 minute (60 * 1000)
        }
        this.theAxios = axios_1.default.create(config);
        this.emit('ready');
    }
    // handler
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns {RsoAxiosResponse}
     */
    errorHandler(error) {
        this.emit('error', {
            errorCode: 'RsoAxios_Request_Error',
            message: error.message,
            data: error,
        });
        return {
            isError: error.isAxiosError,
            response: error.response,
            error: error,
        };
    }
    // request
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    get(url, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            let _error = false;
            const RequestData = {
                method: 'get',
                url: url,
                config: config,
            };
            this.emit('request', RequestData);
            //request
            const _request = yield this.theAxios.get(url, config).catch((error) => {
                return this.errorHandler(error);
            }).then((response) => {
                return response;
            });
            //return
            return {
                isError: _error,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    post(url, body = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            let _error = false;
            const RequestData = {
                method: 'post',
                url: url,
                body: body,
                config: config,
            };
            this.emit('request', RequestData);
            //request
            const _request = yield this.theAxios.post(url, body, config).catch((error) => {
                return this.errorHandler(error);
            }).then((response) => {
                return response;
            });
            //return
            return {
                isError: _error,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    put(url, body = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            let _error = false;
            const RequestData = {
                method: 'put',
                url: url,
                body: body,
                config: config,
            };
            this.emit('request', RequestData);
            //request
            const _request = yield this.theAxios.put(url, body, config).catch((error) => {
                return this.errorHandler(error);
            }).then((response) => {
                return response;
            });
            //return
            return {
                isError: _error,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    patch(url, body = {}, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            let _error = false;
            const RequestData = {
                method: 'patch',
                url: url,
                body: body,
                config: config,
            };
            this.emit('request', RequestData);
            //request
            const _request = yield this.theAxios.patch(url, body, config).catch((error) => {
                return this.errorHandler(error);
            }).then((response) => {
                return response;
            });
            //return
            return {
                isError: _error,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    delete(url, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //setup
            let _error = false;
            const RequestData = {
                method: 'delete',
                url: url,
                config: config,
            };
            this.emit('request', RequestData);
            //request
            const _request = yield this.theAxios.post(url, config).catch((error) => {
                return this.errorHandler(error);
            }).then((response) => {
                return response;
            });
            //return
            return {
                isError: _error,
                response: _request,
            };
        });
    }
}
exports.RsoAxios = RsoAxios;
//# sourceMappingURL=Axios.js.map