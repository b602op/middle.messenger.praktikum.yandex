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

type IData = Record<string, string>;

function queryStringify(data: IData) {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);

    return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

export class HTTPTransport {
    static API_URL = "https://ya-praktikum.tech/api/v2";
    protected endpoint: string;
    protected _request: any = () => {};

    constructor(endpoint: string, isXMLHttpRequest?: boolean) {
        this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
        this._request = isXMLHttpRequest ? this.xmlRequest : this.request;
    }

    get = async<T>(path = "/", data?: unknown): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this._request(this.endpoint + path, data as any);

        const responseData = await response.json();

        const status = response.status as number;

        return { status, data: responseData, response };
    };

    post = async<T>(path: string, data?: unknown): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this._request(this.endpoint + path, {
            method: Method.Post,
            data,
            headers: {
                accept: "application/json"
            }
        });

        const status = response.status as number;

        let newData = null;

        if (response?.data) {
            newData = await response.data.json();
        }

        try {
            if (!newData) {
                newData = await response?.json();
            }
        } catch {
            newData = response?.ok;
        }

        return { status, data: newData, response };
    };

    put = async<T>(path: string, data: unknown, type?: TypeRequest): Promise<{ status: number; data: T; response: Response }> => {
        const response = await this._request(this.endpoint + path, {
            method: Method.Put,
            data,
            type
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

    // public async patch<Response = void>(path: string, data: unknown): Promise<Response> {
    //     return await this._request<Response>(this.endpoint + path, {
    //         method: Method.Patch,
    //         data
    //     });
    // }

    public async delete<Response>(path: string, data?: unknown, type?: TypeRequest): Promise<Response> {
        return await this._request(this.endpoint + path, {
            method: Method.Delete,
            data,
            type
        });
    }

    public async request(url: string, options: Options = { method: Method.Get }): Promise<any> {
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

    private xmlRequest<Response>(url: string, options: Options = { method: Method.Get }): Promise<Response> {
        const { method, data } = options;
    
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
    
          const isGet = method === Method.Get;
          xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);
          // xhr.open(method, url);
    
          xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
              return;
            }
            if (xhr.status < 400) {
              resolve(xhr.response);
            } else {
              reject(xhr.response);
            }
          };
    
          xhr.onabort = () => reject({ reason: 'abort' });
          xhr.onerror = () => reject({ reason: 'network error' });
          xhr.ontimeout = () => reject({ reason: 'timeout' });
    
          if (!(data instanceof FormData)) {
            xhr.setRequestHeader('Content-Type', 'application/json');
          }
    
          xhr.withCredentials = true;
          xhr.responseType = 'json';
    
          if (method === Method.Get || !data) {
            xhr.send();
          } else {
            const body = data instanceof FormData ? data : JSON.stringify(data);
            xhr.send(body);
          }
        });
      }
}
