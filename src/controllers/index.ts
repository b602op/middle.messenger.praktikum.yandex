import { AuthAPI, ChatAPI, UserAPI, type ISignInData, type ISignUpData, type IRemoveUsersFromChatData, ChatsTokenAPI } from "../api/AuthAPI";
import store from "../core/Store";

export interface IResponse<T = unknown> {
    status: number;
    data: T;
}

class AuthController {
    private readonly api = new AuthAPI();
    private readonly apiChat = new ChatAPI();
    private readonly apiUser = new UserAPI();
    private readonly apiChatsTokenApi = new ChatsTokenAPI();

    public setAvatar(data: FormData, callback?: () => void): void {
        this.apiUser.setAvatar(data)
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("user", data);
                }
            })
            .catch(console.error)
            .finally(() => { if (callback) callback(); });
    }

    public searchUser(login: string, callback?: () => void): void {
        this.apiUser.searchUser({ login })
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("userSearch", data);
                }
            })
            .catch(console.error)
            .finally(() => { if (callback) callback(); });
    }

    public signIn(data: ISignInData, callback?: () => void): void {
        this.api.signIn(data)
            .then(({ status }) => {
                console.info("статус sign fetch", status);
            })
            .catch(problems => {
                console.error("запрос на аутентификацию не отработал: ", problems);
            })
            .finally(() => { if (callback) callback(); });
    }

    public signUp(data: ISignUpData, callback?: () => void): void {
        this.api.signup(data)
            .then(({ data, status }) => {
                console.info(data, status);
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => { if (callback) callback(); });
    }

    public getChats(): void {
        store.set("loading.chats", true);

        this.apiChat.getChats()
            .then(({ data, status }) => {
                if (status === 200) {
                    store.set("chats", data);
                    store.set("loading.chats", false);
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => { store.set("loading.chats", false); });
    }

    public changeProfile(data: any): void {
        this.apiUser.changeProfile(data)
            .then((answer) => {
                const { data, status } = answer;
                if (status === 200) {
                    console.log(answer, " answeransweranswer?");
                    store.set("user", data);
                }
            })
            .catch((problems: any) => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => { store.set("loading.chats", false); });
    }

    public removeChat(chatId: number): void {
        this.apiChat.removeChat({ chatId })
            .then(({ status }) => {
                if (status === 200) {
                    const { chats = [] } = store.getState();
                    store.set("chats", [...chats].filter(({ id }) => id !== chatId));
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(console.info);
    }

    public addUserInChat(data2: { users: number[]; chatId: number }, callback?: () => void): void {
        this.apiChat.addUserInChat(data2)
            .then(({ status }) => {
                if (status === 200) {
                    store.set("userSearch", []);
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => { if (callback) callback(); });
    }

    public createChat(title: string): void {
        store.set("loading.createChats", true);

        this.apiChat.createChat({ title })
            .then(({ status, data }) => {
                if (status === 200) {
                    const { chats = [] } = store.getState();

                    store.set("chats", [...chats, { ...(data || {}), title }]);

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

    public getChatUser(activeChatId: number, force?: boolean): void {
        const test: Record<string, any[]> = (store.getState() as any).userList;

        if (!force && test && (activeChatId in test)) {
            return;
        }

        this.apiChat.getChatUser({ activeChatId })
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("userList", { ...test, [activeChatId]: data });
                }
            })
            .catch(console.error)
            .finally(console.info);
    }

    public removeUserFromChat(removeData: IRemoveUsersFromChatData): void {
        console.log(removeData, " data");

        this.apiChat.removeUserFromChat(removeData)
            .then(({ status, data }) => {
                console.log(status, data, " removeUserFromChat");
                // if (status === 200) {
                //     store.set("userList", { ...test, [activeChatId]: data });
                // }
            })
            .catch(console.error)
            .finally(console.info);
    }

    public getToken(data: { id: number }): void {
        store.set("chatsToken.loading", true);
        store.set("chatsToken.errors", null);

        this.apiChatsTokenApi.getToken(data)
            .then(({ status, data }) => {
                console.log(status, data, " removeUserFromChat");

                if (status === 200) {
                    store.set("chatsToken.data", data);
                }
            })
            .catch(console.error)
            .finally(console.info);
    }
}

const controller = new AuthController();

export { controller };
