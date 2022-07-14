"use strict";
//import
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValAuthAxios = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const axios_1 = tslib_1.__importDefault(require("axios"));
//class
class ValAuthAxios extends events_1.EventEmitter {
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
    //handler
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns {ValAuthAxios.Response}
     */
    errorHandler(error) {
        this.emit('error', {
            errorCode: 'ValAuthAxios_Request_Error',
            message: error.message,
            data: error,
        });
        return {
            isError: error.isAxiosError,
            response: error.response,
            error: error,
        };
    }
    //request
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    get(url, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //setup
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
                isError: false,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    post(url, body = {}, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //setup
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
                isError: false,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    put(url, body = {}, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //setup
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
                isError: false,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    patch(url, body = {}, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //setup
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
                isError: false,
                response: _request,
            };
        });
    }
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    delete(url, config = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //setup
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
                isError: false,
                response: _request,
            };
        });
    }
}
exports.ValAuthAxios = ValAuthAxios;
