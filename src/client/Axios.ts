//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

namespace ValSoAxios {
    export interface Error {
        errorCode: string;
        message: string;
        data: any;
    }
    
    export interface Response<ValSoAxiosReturn = any> {
        isError: boolean;
        response: AxiosResponse<ValSoAxiosReturn>;
        error?: AxiosError;
    }
    
    export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
    
    export interface EventData {
        method: ValSoAxios.Method;
        url: string;
        body?: Object;
        config: AxiosRequestConfig;
    }

    export interface Event {
        'ready': () => void;
        'request': (data: ValSoAxios.EventData) => void;
        'error': (data: ValSoAxios.Error) => void;
    }
}

//event

declare interface ValSoAxios {
    emit<EventName extends keyof ValSoAxios.Event>(name: EventName, ...args: Parameters<ValSoAxios.Event[EventName]>): any;
    on<EventName extends keyof ValSoAxios.Event>(name: EventName, callback: ValSoAxios.Event[EventName]): any;
    once<EventName extends keyof ValSoAxios.Event>(name: EventName, callback: ValSoAxios.Event[EventName]): any;
    off<EventName extends keyof ValSoAxios.Event>(name: EventName, callback?: ValSoAxios.Event[EventName]): any;
}

//class

class ValSoAxios extends EventEmitter {
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
     * @returns {ValSoAxios.Response}
     */
    private errorHandler(error: AxiosError): ValSoAxios.Response {
        this.emit('error', {
            errorCode: 'ValSoAxios_Request_Error',
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
    * @returns {Promise<ValSoAxios.Response>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<ValSoAxios.Response> {
        //setup
        const RequestData: ValSoAxios.EventData = {
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
    * @returns {Promise<ValSoAxios.Response>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValSoAxios.Response> {
        //setup
        const RequestData: ValSoAxios.EventData = {
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
    * @returns {Promise<ValSoAxios.Response>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValSoAxios.Response> {
        //setup
        const RequestData: ValSoAxios.EventData = {
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
    * @returns {Promise<ValSoAxios.Response>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValSoAxios.Response> {
        //setup
        const RequestData: ValSoAxios.EventData = {
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
    * @returns {Promise<ValSoAxios.Response>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<ValSoAxios.Response> {
        //setup
        const RequestData: ValSoAxios.EventData = {
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
    ValSoAxios
};