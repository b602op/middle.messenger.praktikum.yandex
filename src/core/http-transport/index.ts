export enum Method {
    Get = "Get",
    Post = "Post",
    Put = "Put",
    Patch = "Patch",
    Delete = "Delete"
}

export enum TypeRequest {
    file = "file",
    delete = "delete"
}

interface Options {
    method: Method;
    data?: any;
    type?: TypeRequest;
    spreadData?: any;
    headers?: any;
}

export class HTTPTransport {
    static API_URL = "https://ya-praktikum.tech/api/v2";
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
    }

    get = async<T>(path = "/", data?: unknown): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this.request(this.endpoint + path, data as any);

        const responseData = await response.json();

        const status = response.status as number;

        return { status, data: responseData, response };
    };

    post = async<T>(path: string, data?: unknown): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this.request(this.endpoint + path, {
            method: Method.Post,
            data,
            headers: {
                accept: "application/json"
            }
        });

        const status = response.status as number;

        let newData = null;

        if (response.data) {
            newData = await response.data.json();
        }

        if (response && !newData) {
            newData = await response.json();
        }

        return { status, data: newData, response };
    };

    put = async<T>(path: string, data: unknown, type?: TypeRequest): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this.request(this.endpoint + path, {
            method: Method.Put,
            data,
            type
        });

        const status = response.status as number;

        let newData = null;

        if (response.data) {
            newData = await response.data.json();
        }

        return { status, data: newData, response };
    };

    // public async put<Response = void>(path: string, data: unknown): Promise<Response> {
    //     return await this.request<Response>(this.endpoint + path, {
    //         method: Method.Put,
    //         data
    //     });
    // }

    // public async patch<Response = void>(path: string, data: unknown): Promise<Response> {
    //     return await this.request<Response>(this.endpoint + path, {
    //         method: Method.Patch,
    //         data
    //     });
    // }

    public async delete<Response>(path: string, data?: unknown, type?: TypeRequest): Promise<Response> {
        return await this.request(this.endpoint + path, {
            method: Method.Delete,
            data,
            type
        });
    }

    private async request(url: string, options: Options = { method: Method.Get }): Promise<any> {
        const { method, data, type, headers } = options;

        const defaultOptions: RequestInit = {
            method,
            credentials: "include"
        };
        let currentOptions: RequestInit = {};

        switch (type) {
            case TypeRequest.delete: {
                currentOptions = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: data ? JSON.stringify(data) : data
                };
                break;
            }
            case TypeRequest.file: {
                currentOptions = {
                    body: data
                };
                break;
            }
            default: {
                currentOptions = {
                    headers: {
                        "Content-Type": "application/json",
                        ...(headers || {})
                    },
                    body: data ? JSON.stringify(data) : data
                };
            }
        }

        const test = await fetch(url, {
            ...defaultOptions,
            ...currentOptions
        });

        return test;
    }
}
