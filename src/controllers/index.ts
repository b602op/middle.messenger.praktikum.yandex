import { AuthAPI, ChatAPI, UserAPI, type ISignInData, type ISignUpData, type IRemoveUsersFromChatData, ChatsTokenAPI } from "../api/AuthAPI";
import { type UserFormFields } from "../components/forms/types/fields";
import store from "../core/Store";

export interface IResponse<T = unknown> {
    status: number;
    data: T;
}

interface CallbackTypes { good?: () => void; bad?: (value?: any) => void };

class AuthController {
    private readonly api = new AuthAPI();
    private readonly apiChat = new ChatAPI();
    private readonly apiUser = new UserAPI();
    private readonly apiChatsTokenApi = new ChatsTokenAPI();

    public setAvatar(data: FormData, callbacks?: CallbackTypes): void {
        this.apiUser.setAvatar(data)
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("user", data);
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public changePassword(data: { oldPassword: string; newPassword: string }, callbacks?: CallbackTypes): void {
        this.apiUser.changePassword(data)
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("user", data);
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public searchUser(login: string, callbacks?: CallbackTypes): void {
        this.apiUser.searchUser({ login })
            .then(({ status, data }) => {
                if (status === 200) {
                    store.set("userSearch", data);
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public signIn(data: ISignInData, callbacks?: CallbackTypes): void {
        this.api.signIn(data)
            .then(({ status, data }) => {
                if (status && (status !== 200)) {
                    if (callbacks?.bad) callbacks.bad({ status, data });
                } else {
                    if (callbacks?.good) callbacks.good();
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => {});
    }

    public signUp(data: ISignUpData, callbacks?: CallbackTypes): void {
        this.api.signup(data)
            .then(({ data, status }) => {
                console.info(data, status);
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
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

    public changeProfile(data: Omit<UserFormFields, "id" | "avatar" | "password">, callbacks: CallbackTypes): void {
        this.apiUser.changeProfile(data)
            .then((answer) => {
                const { data, status } = answer;
                if (status === 200) {
                    store.set("user", data);

                    if (callbacks?.good) callbacks?.good();
                }
            })
            .catch((problems: any) => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(() => { store.set("loading.chats", false); });
    }

    public removeChat(chatId: number, callbacks?: CallbackTypes): void {
        this.apiChat.removeChat({ chatId })
            .then((answerRemoveChat) => {
                console.log(answerRemoveChat, answerRemoveChat.data, " answerRemoveChat>?");
                if (answerRemoveChat.status === 200) {
                    if (callbacks?.good) callbacks.good();
                //     const { chats = [] } = store.getState();
                //     store.set("chats", [...chats].filter(({ id }) => id !== chatId));
                }
            })
            .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
            .finally(console.info);
    }

    public addUserInChat(data2: { users: number[]; chatId: number }, callbacks?: CallbackTypes): void {
        this.apiChat.addUserInChat(data2)
            .then(({ status }) => {
                if (status === 200) {
                    store.set("userSearch", []);
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public createChat(title: string, callbacks?: CallbackTypes): void {
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
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public getUser(callbacks?: CallbackTypes): void {
        this.api.getUser()
            .then(({ data, status }) => {
                if (status === 200) {
                    store.set("user", data);
                }
                console.info("статус user fetch: ", status);
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => { if (callbacks?.good) callbacks.good(); });
    }

    public logout(callbacks?: CallbackTypes): void {
        this.api.logout()
            .then((answer) => answer)
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => {
                store.set("user", undefined);

                if (callbacks?.good) callbacks.good();
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

    public removeUserFromChat(removeData: IRemoveUsersFromChatData, callbacks?: CallbackTypes): void {
        this.apiChat.removeUserFromChat(removeData)
            .then(({ status, data }) => {
                if (status === 200) {
                    if (callbacks?.good) callbacks.good();
                }
            })
            .catch((error) => { if (callbacks?.bad) callbacks.bad(error); })
            .finally(() => {});
    }

    public getToken(data: { id: number }): void {
        store.set("chatsToken.loading", true);
        store.set("chatsToken.errors", null);

        this.apiChatsTokenApi.getToken(data)
            .then(({ status, data }) => {
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
