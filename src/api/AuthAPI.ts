import { API } from "./api";

export interface ISignUpData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface ISignInData {
    login: string;
    password: string;
}

export interface IUser {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
    avatar: string;
}

export interface IResponse<TResponseData = any> {
    status: number;
    data: TResponseData;
}

export interface IResponseError {
    reason: string;
}

export class AuthAPI extends API {
    constructor() {
        super("/auth");
    }

    async signin<T>(data: ISignInData): Promise<IResponse<T>> {
        return await this.http.post("/signin", data);
    }

    async signup<T>(data: ISignUpData): Promise<IResponse<T>> {
        return await this.http.post("/signup", data);
    }

    async logout<T>(): Promise<IResponse<T>> {
        return await this.http.post("/logout");
    }

    async getUser<T>(): Promise<IResponse<T>> {
        return await this.http.get("/user");
    }
};
