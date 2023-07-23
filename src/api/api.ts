import { HTTPTransport } from "../core/http-transport";

export abstract class API {
    protected http: HTTPTransport;

    protected constructor(endpoint: string) {
        this.http = new HTTPTransport(endpoint);
    }
}
