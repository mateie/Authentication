//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

namespace ValAuthAxios {
    export interface Error {
        errorCode: string;
        message: string;
        data: any;
    }
    
    export interface Response<ValAuthAxiosReturn = any> {
        isError: boolean;
        response: AxiosResponse<ValAuthAxiosReturn>;
        error?: AxiosError;
    }
    
    export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
    
    export interface EventData {
        method: ValAuthAxios.Method;
        url: string;
        body?: Object;
        config: AxiosRequestConfig;
    }

    export interface Event {
        'ready': () => void;
        'request': (data: ValAuthAxios.EventData) => void;
        'error': (data: ValAuthAxios.Error) => void;
    }
}

//event

declare interface ValAuthAxios {
    emit<EventName extends keyof ValAuthAxios.Event>(name: EventName, ...args: Parameters<ValAuthAxios.Event[EventName]>): any;
    on<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback: ValAuthAxios.Event[EventName]): any;
    once<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback: ValAuthAxios.Event[EventName]): any;
    off<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback?: ValAuthAxios.Event[EventName]): any;
}

//class

class ValAuthAxios extends EventEmitter {
    //constructor

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

    //handler

    /**
     * 
     * @param {AxiosError} error Axios Error
     * @returns {ValAuthAxios.Response}
     */
    private errorHandler(error: AxiosError): ValAuthAxios.Response {
        this.emit('error', {
            errorCode: 'ValAuthAxios_Request_Error',
            message: error.message,
            data: error,
        });

        return {
            isError: error.isAxiosError,
            response: error.response as AxiosResponse,
            error: error,
        };
    }

    //request

    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<ValAuthAxios.Response> {
        //setup
        const RequestData: ValAuthAxios.EventData = {
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
    * @returns {Promise<ValAuthAxios.Response>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValAuthAxios.Response> {
        //setup
        const RequestData: ValAuthAxios.EventData = {
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
    * @returns {Promise<ValAuthAxios.Response>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValAuthAxios.Response> {
        //setup
        const RequestData: ValAuthAxios.EventData = {
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
    * @returns {Promise<ValAuthAxios.Response>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValAuthAxios.Response> {
        //setup
        const RequestData: ValAuthAxios.EventData = {
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
    * @returns {Promise<ValAuthAxios.Response>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<ValAuthAxios.Response> {
        //setup
        const RequestData: ValAuthAxios.EventData = {
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
    ValAuthAxios
};