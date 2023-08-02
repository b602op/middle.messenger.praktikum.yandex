import { TypeRequest } from "../core/http-transport";
import { API } from "./api";

export interface ISignUpData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface ICreateChatData {
    title: string;
}

export interface IGetActiveChatUser {
    activeChatId: number;
}

export interface IRemoveUsersFromChatData {
    users: number[];
    chatId: number;
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

    async signIn<T>(data: ISignInData): Promise<IResponse<T>> {
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

    async getChats<T>(): Promise<IResponse<T>> {
        return await this.http.post("/chats");
    }
};
export class ChatAPI extends API {
    constructor() {
        super("/chats");
    }

    async getChats<T>(): Promise<IResponse<T>> {
        return await this.http.get();
    }

    async createChat<T>(data: ICreateChatData): Promise<IResponse<T>> {
        return await this.http.post("", data);
    }

    async getChatUser<T>(data: IGetActiveChatUser): Promise<IResponse<T>> {
        return await this.http.get(`/${data.activeChatId}/users`, { ...data, offset: 0, limit: 999 });
    }

    async removeUserFromChat<T>(data: IRemoveUsersFromChatData): Promise<IResponse<T>> {
        return await this.http.delete(`/users`, data, TypeRequest.delete);
    }

    async addUserInChat<T>(data: any): Promise<IResponse<T>> {
        return await this.http.put(`/users`, data);
    }

    async removeChat<T>(data: { chatId: number }): Promise<IResponse<T>> {
        return await this.http.delete("", data);
    }
};

export class UserAPI extends API {
    constructor() {
        super("/user");
    }

    async setAvatar<T>(data: any): Promise<IResponse<T>> {
        return await this.http.put("/profile/avatar", data, TypeRequest.file);
    }

    async searchUser<T>(data: { login: string }): Promise<IResponse<T>> {
        return await this.http.post("/search", data);
    }
};
