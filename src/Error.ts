import { ValAuthEngine } from './client/Engine';

export class ValError extends Error {
    readonly data?: ValAuthEngine.Json;

    constructor({
        name,
        message,
        data,
    }: {
        name: string;
        message: string;
        data?: ValAuthEngine.Json;
    }) {
        super(message);

        this.name = name;
        this.message = message;
        this.data = data;
    }
}
