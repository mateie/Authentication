//import

import { EventEmitter } from 'events';
import axios, { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

//interface

interface ValRsoAxiosError {
    errorCode: string;
    message: string;
    data: any;
}

interface ValRsoAxiosResponse<ValRsoAxiosReturn = any> {
    isError: boolean;
    response: AxiosResponse<ValRsoAxiosReturn>;
    error?: AxiosError;
}

type ValRsoAxiosMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ValRsoAxiosEventData {
    method: ValRsoAxiosMethod;
    url: string;
    body?: Object;
    config: AxiosRequestConfig;
}

//event

interface ValRsoAxiosEvent {
    'ready': () => void;
    'request': (data: ValRsoAxiosEventData) => void;
    'error': (data: ValRsoAxiosError) => void;
}

declare interface ValRsoAxios {
    emit<EventName extends keyof ValRsoAxiosEvent>(name: EventName, ...args: Parameters<ValRsoAxiosEvent[EventName]>): any;
    on<EventName extends keyof ValRsoAxiosEvent>(name: EventName, callback: ValRsoAxiosEvent[EventName]): any;
    once<EventName extends keyof ValRsoAxiosEvent>(name: EventName, callback: ValRsoAxiosEvent[EventName]): any;
    off<EventName extends keyof ValRsoAxiosEvent>(name: EventName, callback?: ValRsoAxiosEvent[EventName]): any;
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
     * @returns {ValRsoAxiosResponse}
     */
    private errorHandler(error: AxiosError): ValRsoAxiosResponse {
        this.emit('error', {
            errorCode: 'ValRsoAxios_Request_Error',
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
    * @returns {Promise<ValRsoAxiosResponse>}
    */
    public async get(url: string, config: AxiosRequestConfig = {}): Promise<ValRsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: ValRsoAxiosEventData = {
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
    * @returns {Promise<ValRsoAxiosResponse>}
    */
    public async post(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: ValRsoAxiosEventData = {
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
    * @returns {Promise<ValRsoAxiosResponse>}
    */
    public async put(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: ValRsoAxiosEventData = {
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
    * @returns {Promise<ValRsoAxiosResponse>}
    */
    public async patch(url: string, body: object = {}, config: AxiosRequestConfig = {}): Promise<ValRsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: ValRsoAxiosEventData = {
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
    * @returns {Promise<ValRsoAxiosResponse>}
    */
    public async delete(url: string, config: AxiosRequestConfig = {}): Promise<ValRsoAxiosResponse> {
        //setup
        let _error = false;

        const RequestData: ValRsoAxiosEventData = {
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
    ValRsoAxios
};
export type {
    ValRsoAxiosError, ValRsoAxiosResponse, ValRsoAxiosMethod, ValRsoAxiosEventData, ValRsoAxiosEvent
};