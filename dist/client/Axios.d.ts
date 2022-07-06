/// <reference types="node" />
import { EventEmitter } from 'events';
import { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
declare namespace ValRsoAxios {
    interface Error {
        errorCode: string;
        message: string;
        data: any;
    }
    interface Response<ValRsoAxiosReturn = any> {
        isError: boolean;
        response: AxiosResponse<ValRsoAxiosReturn>;
        error?: AxiosError;
    }
    type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
    interface EventData {
        method: ValRsoAxios.Method;
        url: string;
        body?: Object;
        config: AxiosRequestConfig;
    }
    interface Event {
        'ready': () => void;
        'request': (data: ValRsoAxios.EventData) => void;
        'error': (data: ValRsoAxios.Error) => void;
    }
}
declare interface ValRsoAxios {
    emit<EventName extends keyof ValRsoAxios.Event>(name: EventName, ...args: Parameters<ValRsoAxios.Event[EventName]>): any;
    on<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback: ValRsoAxios.Event[EventName]): any;
    once<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback: ValRsoAxios.Event[EventName]): any;
    off<EventName extends keyof ValRsoAxios.Event>(name: EventName, callback?: ValRsoAxios.Event[EventName]): any;
}
declare class ValRsoAxios extends EventEmitter {
    theAxios: Axios;
    /**
     * Class Constructor
     * @param {AxiosRequestConfig} config Config
     */
    constructor(config?: AxiosRequestConfig);
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns {ValRsoAxios.Response}
     */
    private errorHandler;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    get(url: string, config?: AxiosRequestConfig): Promise<ValRsoAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    post(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValRsoAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    put(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValRsoAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    patch(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValRsoAxios.Response>;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValRsoAxios.Response>}
    */
    delete(url: string, config?: AxiosRequestConfig): Promise<ValRsoAxios.Response>;
}
export { ValRsoAxios };
//# sourceMappingURL=Axios.d.ts.map