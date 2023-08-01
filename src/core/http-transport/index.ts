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

    get = async<T>(path = "/"): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this.request(this.endpoint + path);

        const data = await response.json();

        const status = response.status as number;

        return { status, data, response };
    };

    post = async<T>(path: string, data?: unknown): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this.request(this.endpoint + path, {
            method: Method.Post,
            data
        });

        const status = response.status as number;

        let newData = null;

        if (response.data) {
            newData = await response.data.json();
        }

        console.log(status, newData, response, " answer post");

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

    // public async delete<Response>(path: string): Promise<Response> {
    //     return await this.request<Response>(this.endpoint + path, {
    //         method: Method.Delete
    //     });
    // }

    private async request(url: string, options: Options = { method: Method.Get }): Promise<any> {
        const { method, data } = options;

        const test = await fetch(url, {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: data ? JSON.stringify(data) : data
        });

        return test;
    }
}
