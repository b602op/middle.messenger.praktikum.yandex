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

export class AuthAPI extends API {
    constructor() {
        super("/auth");
    }

    async signin(data: ISignInData): Promise<void> {
        await this.http.post("/signin", data);
    }

    async signup(data: ISignUpData): Promise<void> {
        await this.http.post("/signup", data);
    }

    async logout(): Promise<void> {
        await this.http.post("/logout");
    }

    async getUser(): Promise<IUser> {
        return await this.http.get("/user");
    }
};
