//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

interface RsoAxiosError {
    errorCode: string;
    message: string;
    data: any;
}

interface RsoAxiosResponse<RsoAxiosReturn = any> {
    isError: boolean;
    response: AxiosResponse<RsoAxiosReturn>;
    error?: AxiosError;
}

type RsoAxiosMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RsoAxiosEventData {
    method: RsoAxiosMethod;
    url: string;
    body?: Object;
    config: AxiosRequestConfig;
}

//event

interface RsoAxiosEvent {
    'ready': () => void;
    'request': (data: RsoAxiosEventData) => void;
    'error': (data: RsoAxiosError) => void;
}

declare interface RsoAxios {
    emit<EventName extends keyof RsoAxiosEvent>(name: EventName, ...args: Parameters<RsoAxiosEvent[EventName]>): any;
    on<EventName extends keyof RsoAxiosEvent>(name: EventName, callback: RsoAxiosEvent[EventName]): any;
    once<EventName extends keyof RsoAxiosEvent>(name: EventName, callback: RsoAxiosEvent[EventName]): any;
    off<EventName extends keyof RsoAxiosEvent>(name: EventName, callback?: RsoAxiosEvent[EventName]): any;
}

//class

class RsoAxios extends EventEmitter {
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
     * @returns {RsoAxiosResponse}
     */
    private errorHandler(error: AxiosError): RsoAxiosResponse {
        this.emit('error', {
            errorCode: 'RsoAxios_Request_Error',
            message: error.message,
            data: error,
        })

        return {
            isError: error.isAxiosError,
            response: error.response as AxiosResponse,
            error: error,
        };
    }

    // request

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<RsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: RsoAxiosEventData = {
            method: 'get',
            url: url,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.get(url, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            return response;
        });

        //return
        return {
            isError: _error,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: RsoAxiosEventData = {
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
            return response;
        });

        //return
        return {
            isError: _error,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: RsoAxiosEventData = {
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
            return response;
        });

        //return
        return {
            isError: _error,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<RsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: RsoAxiosEventData = {
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
            return response;
        });

        //return
        return {
            isError: _error,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<RsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: RsoAxiosEventData = {
            method: 'delete',
            url: url,
            config: config,
        };
        this.emit('request', RequestData);

        //request
        const _request: any = await this.theAxios.post(url, config).catch((error: AxiosError): any => {
            return this.errorHandler(error);

        }).then((response: AxiosResponse) => {
            return response;
        });

        //return
        return {
            isError: _error,
            response: _request,
        };
    }
}

//export

export {
    RsoAxios
};
export type {
    RsoAxiosError, RsoAxiosResponse, RsoAxiosMethod, RsoAxiosEventData, RsoAxiosEvent
};