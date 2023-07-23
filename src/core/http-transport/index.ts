export enum Method {
    Get = "Get",
    Post = "Post",
    Put = "Put",
    Patch = "Patch",
    Delete = "Delete"
}

interface Options {
    method: Method;
    data?: any;
}

export class HTTPTransport {
    static API_URL = "https://ya-praktikum.tech/api/v2";
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
    }

    public async get<Response>(path = "/"): Promise<Response> {
        return await this.request<Response>(this.endpoint + path);
    }

    public async post<Response = void>(path: string, data?: unknown): Promise<Response> {
        return await this.request<Response>(this.endpoint + path, {
            method: Method.Post,
            data
        });
    }

    public async put<Response = void>(path: string, data: unknown): Promise<Response> {
        return await this.request<Response>(this.endpoint + path, {
            method: Method.Put,
            data
        });
    }

    public async patch<Response = void>(path: string, data: unknown): Promise<Response> {
        return await this.request<Response>(this.endpoint + path, {
            method: Method.Patch,
            data
        });
    }

    public async delete<Response>(path: string): Promise<Response> {
        return await this.request<Response>(this.endpoint + path, {
            method: Method.Delete
        });
    }

    private async request<Response>(url: string, options: Options = { method: Method.Get }): Promise<Response> {
        const { method, data } = options;

        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.onreadystatechange = (e) => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.onabort = () => reject;
            xhr.onerror = () => reject;
            xhr.ontimeout = () => reject;

            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.withCredentials = true;
            xhr.responseType = "json";

            if (method === Method.Get || !data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
