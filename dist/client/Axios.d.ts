/// <reference types="node" />
import { EventEmitter } from 'events';
import { type Axios, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
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
declare type RsoAxiosMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
interface RsoAxiosEventData {
    method: RsoAxiosMethod;
    url: string;
    body?: Object;
    config: AxiosRequestConfig;
}
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
declare class RsoAxios extends EventEmitter {
    theAxios: Axios;
    /**
     * Class Constructor
     * @param {AxiosRequestConfig} config Config
     */
    constructor(config?: AxiosRequestConfig);
    /**
     *
     * @param {AxiosError} error Axios Error
     * @returns {RsoAxiosResponse}
     */
    private errorHandler;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    get(url: string, config?: AxiosRequestConfig): Promise<RsoAxiosResponse>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    post(url: string, body?: object, config?: AxiosRequestConfig): Promise<RsoAxiosResponse>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    put(url: string, body?: object, config?: AxiosRequestConfig): Promise<RsoAxiosResponse>;
    /**
    * @param {String} url URL
    * @param {Object} body Body
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    patch(url: string, body?: object, config?: AxiosRequestConfig): Promise<RsoAxiosResponse>;
    /**
    * @param {String} url URL
    * @param {AxiosRequestConfig} config Axios Config
    * @returns {Promise<RsoAxiosResponse>}
    */
    delete(url: string, config?: AxiosRequestConfig): Promise<RsoAxiosResponse>;
}
export { RsoAxios };
export type { RsoAxiosError, RsoAxiosResponse, RsoAxiosMethod, RsoAxiosEventData, RsoAxiosEvent };
//# sourceMappingURL=Axios.d.ts.map