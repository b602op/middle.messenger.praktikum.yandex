import { AuthAPI, ChatAPI, UserAPI, type ISignInData, type ISignUpData } from "../api/AuthAPI";
import Router, { RouterPath } from "../core/Router";
import store from "../core/Store";

export interface IResponse<T = unknown> {
    status: number;
    data: T;
}

class AuthController {
    private readonly api = new AuthAPI();
    private readonly apiChat = new ChatAPI();
    private readonly apiUser = new UserAPI();

    public setAvatar(data: FormData): void {
        console.log(data, " data");
        this.apiUser.setAvatar(data)
            .then(console.log)
            .catch(console.log)
            .catch(console.log);
    }

    public signIn(data: ISignInData, callback?: () => void): void {
        this.api.signIn(data)
            .then(({ status }) => {
                console.info("статус sign fetch", status);
            })
            .catch(problems => {
                console.log("запрос на аутентификацию не отработал: ", problems);
            })
            .finally(() => { if (callback) callback(); });
    }

    public signUp(data: ISignUpData): void {
        this.api.signup(data)
            .then(({ data, status }) => {
                console.log(data, status);
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(console.log);
    }

    public getChats(): void {
        store.set("loading.chats", true);

        this.apiChat.getChats()
            .then(async({ data, status }) => {
                if (status === 200) {
                    store.set("chats", data);
                    store.set("loading.chats", false);
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(console.info);
    }

    public createChat(title: string): void {
        store.set("loading.createChats", true);

        this.apiChat.createChat({ title })
            .then(({ status }) => {
                if (status === 200) {
                    console.info("успешно добавлен чат с ", title);
                } else {
                    console.info("ошибка добавления чата с ", title);
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => {
                store.set("loading.createChats", false);
            });
    }

    public getUser(callback?: () => void): void {
        this.api.getUser()
            .then(({ data, status }) => {
                if (status === 200) {
                    store.set("user", data);
                }
                console.info("статус user fetch: ", status);
            })
            .catch(answer => answer)
            .finally(() => { if (callback) callback(); });
    }

    public logout(callback?: () => void): void {
        this.api.logout()
            .then((answer) => answer)
            .catch(answer => answer)
            .finally(() => {
                store.set("user", undefined);

                if (callback) callback();
            });
    }
}

const controller = new AuthController();

export { controller };
