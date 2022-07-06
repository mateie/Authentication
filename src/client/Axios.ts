//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

namespace ValRsoAxios {
    export interface Error {
        errorCode: string;
        message: string;
        data: any;
    }
    
    export interface Response<ValRsoAxiosReturn = any> {
        isError: boolean;
        response: AxiosResponse<ValRsoAxiosReturn>;
        error?: AxiosError;
    }
    
    export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
    
    export interface EventData {
        method: ValRsoAxios.Method;
        url: string;
        body?: Object;
        config: AxiosRequestConfig;
    }

    export interface Event {
        'ready': () => void;
        'request': (data: ValRsoAxios.EventData) => void;
        'error': (data: ValRsoAxios.Error) => void;
    }
}

//event

declare interface ValRsoAxios {
    emit<EventName extends keyof ValRsoAxios.Event>(name: EventName, ...args: Parameters<ValRsoAxios.Event[EventName]>): any;
    on<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback: ValRsoAxios.Event[EventName]): any;
    once<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback: ValRsoAxios.Event[EventName]): any;
    off<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback?: ValRsoAxios.Event[EventName]): any;
}

//class

class ValRsoAxios extends EventEmitter {
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
     * @returns {ValRsoAxios.Response}
     */
    private errorHandler(error: AxiosError): ValRsoAxios.Response {
        this.emit('error', {
            errorCode: 'ValRsoAxios_Request_Error',
            message: error.message,
            data: error,
        });

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
    * @returns {Promise<ValRsoAxios.Response>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<ValRsoAxios.Response> {
        //setup
        const RequestData: ValRsoAxios.EventData = {
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
            isError: false,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxios.Response> {
        //setup
        const RequestData: ValRsoAxios.EventData = {
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
            isError: false,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxios.Response> {
        //setup
        const RequestData: ValRsoAxios.EventData = {
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
            isError: false,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxios.Response> {
        //setup
        const RequestData: ValRsoAxios.EventData = {
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
            isError: false,
            response: _request,
        };
    }

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<ValRsoAxios.Response> {
        //setup
        const RequestData: ValRsoAxios.EventData = {
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
            isError: false,
            response: _request,
        };
    }
}

//export

export {
    ValRsoAxios
};