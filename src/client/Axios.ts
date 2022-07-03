//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

interface RsoAuthError {
    errorCode: string;
    message: string;
    data: any;
}

interface RsoAuthRequestResponse<RsoAuthRequestReturn = any> {
    isError: boolean;
    data: RsoAuthRequestReturn;
    error?: AxiosError;
}

type RsoAuthRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RsoAuthRequestEventData {
    method: RsoAuthRequestMethod;
    url: string;
    body?: Object;
    config: AxiosRequestConfig;
}

//event

interface RsoAuthRequestEvent {
    'ready': () => void;
    'request': (data: RsoAuthRequestEventData) => void;
    'error': (data: RsoAuthError) => void;
}

declare interface RsoRequestClient {
    emit<EventName extends keyof RsoAuthRequestEvent>(name: EventName, ...args: Parameters<RsoAuthRequestEvent[EventName]>): any;
    on<EventName extends keyof RsoAuthRequestEvent>(name: EventName, callback: RsoAuthRequestEvent[EventName]): any;
    once<EventName extends keyof RsoAuthRequestEvent>(name: EventName, callback: RsoAuthRequestEvent[EventName]): any;
    off<EventName extends keyof RsoAuthRequestEvent>(name: EventName, callback?: RsoAuthRequestEvent[EventName]): any;
}

//class

class RsoRequestClient extends EventEmitter {
    // constructor

    public theAxios: Axios;

    /**
     * Class Constructor
     * @param {AxiosRequestConfig} config Config
     */
    public constructor(config: AxiosRequestConfig = {}) {
        super();

        if (config.timeout && isNaN(config.timeout)) {
            config.timeout = 60000; // 1 minute (60 * 1000)
        }

        this.theAxios = axios.create(config);
        this.emit('ready');
    }

    // handler

    /**
     * 
     * @param {AxiosError} error Axios Error
     * @returns {RsoAuthRequestResponse}
     */
    private errorHandler(error: AxiosError): RsoAuthRequestResponse<any> {
        //event
        this.emit('error', {
            errorCode: 'RsoAuth_Request_Error',
            message: error.message,
            data: error,
        })

        //data
        if (error.response && error.response.data) {
            return {
                isError: error.isAxiosError,
                data: error.response.data,
                error: error,
            }
        }

        if (error.response && error.response.status && error.response.statusText) {
            return {
                isError: error.isAxiosError,
                data: {
                    errorCode: error.response.status,
                    message: error.response.statusText,
                },
                error: error,
            }
        }

        return {
            isError: error.isAxiosError,
            data: {
                errorCode: error.name,
                message: error.message,
            },
            error: error,
        }
    }

    // request

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAuthRequestResponse>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<RsoAuthRequestResponse<any>> {
        //setup
        let _error = false;

        const RequestData: RsoAuthRequestEventData = {
            method: 'get',
            url: url,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.get(url, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            if (_error) {
                return response;
            } else {
                return response.data;
            }
        });

        //return
        return {
            isError: _error,
            data: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAuthRequestResponse>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAuthRequestResponse<any>> {
        //setup
        let _error = false;

        const RequestData: RsoAuthRequestEventData = {
            method: 'post',
            url: url,
            body: body,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.post(url, body, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            if (_error) {
                return response;
            } else {
                return response.data;
            }
        });

        //return
        return {
            isError: _error,
            data: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAuthRequestResponse>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAuthRequestResponse<any>> {
        //setup
        let _error = false;

        const RequestData: RsoAuthRequestEventData = {
            method: 'put',
            url: url,
            body: body,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.put(url, body, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            if (_error) {
                return response;
            } else {
                return response.data;
            }
        });

        //return
        return {
            isError: _error,
            data: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAuthRequestResponse>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAuthRequestResponse<any>> {
        //setup
        let _error = false;

        const RequestData: RsoAuthRequestEventData = {
            method: 'patch',
            url: url,
            body: body,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.patch(url, body, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            if (_error) {
                return response;
            } else {
                return response.data;
            }
        });

        //return
        return {
            isError: _error,
            data: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAuthRequestResponse>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<RsoAuthRequestResponse<any>> {
        //setup
        let _error = false;

        const RequestData: RsoAuthRequestEventData = {
            method: 'delete',
            url: url,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.post(url, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            if (_error) {
                return response;
            } else {
                return response.data;
            }
        });

        //return
        return {
            isError: _error,
            data: _request,
        };
    }
}

//export
export { RsoRequestClient };
export type { RsoAuthError, RsoAuthRequestResponse, RsoAuthRequestMethod, RsoAuthRequestEventData, RsoAuthRequestEvent };