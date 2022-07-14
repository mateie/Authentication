/// <reference types="node" />
import { EventEmitter } from 'events';
import { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
declare namespace ValAuthAxios {
    interface Error {
        errorCode: string;
        message: string;
        data: any;
    }
    interface Response<ValAuthAxiosReturn = any> {
        isError: boolean;
        response: AxiosResponse<ValAuthAxiosReturn>;
        error?: AxiosError;
    }
    type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
    interface EventData {
        method: ValAuthAxios.Method;
        url: string;
        body?: Object;
        config: AxiosRequestConfig;
    }
    interface Event {
        'ready': () => void;
        'request': (data: ValAuthAxios.EventData) => void;
        'error': (data: ValAuthAxios.Error) => void;
    }
}
declare interface ValAuthAxios {
    emit<EventName extends keyof ValAuthAxios.Event>(name: EventName, ...args: Parameters<ValAuthAxios.Event[EventName]>): any;
    on<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback: ValAuthAxios.Event[EventName]): any;
    once<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback: ValAuthAxios.Event[EventName]): any;
    off<EventName extends keyof ValAuthAxios.Event>(name: EventName, callback?: ValAuthAxios.Event[EventName]): any;
}
declare class ValAuthAxios extends EventEmitter {
    theAxios: Axios;
    /**
     * Class Constructor
     * @param {AxiosRequestConfig} config Config
     */
    constructor(config?: AxiosRequestConfig);
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns {ValAuthAxios.Response}
     */
    private errorHandler;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    get(url: string, config?: AxiosRequestConfig): Promise<ValAuthAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    post(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValAuthAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    put(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValAuthAxios.Response>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    patch(url: string, body?: object, config?: AxiosRequestConfig): Promise<ValAuthAxios.Response>;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<ValAuthAxios.Response>}
    */
    delete(url: string, config?: AxiosRequestConfig): Promise<ValAuthAxios.Response>;
}
export { ValAuthAxios };
