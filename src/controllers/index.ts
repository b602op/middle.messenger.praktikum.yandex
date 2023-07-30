import { AuthAPI, type ISignInData, type ISignUpData } from "../api/AuthAPI";
import Router, { RouterPath } from "../core/Router";
import store from "../core/Store";

export interface IResponse<T = unknown> {
    status: number;
    data: T;
}

class AuthController {
    private readonly api = new AuthAPI();

    public signIn(data: ISignInData): void {
        try {
            this.api.signIn(data)
                .then(({ status }) => {
                    if (status !== 200) {
                        console.error(status, " код ответа на аутентификацию не 200");
                    }

                    this.getUser();
                })
                .catch(problems => {
                    console.log("запрос на аутентификацию не отработал: ", problems);
                })
                .finally(console.log);
        } catch (error) {
            console.error(error);
        }
    }

    public signUp(data: ISignUpData): void {
        try {
            this.api.signup(data)
                .then(async({ data, status }) => {
                    if (status === 200) {
                        if ("id" in ((data || {}) as any)) {
                            this.getUser();
                        }
                    } else {
                        console.error(status, data, " запрос на юзера не 200");
                    }
                })
                .catch(problems => { console.error("запрос на юзера не отработал: ", problems); })
                .finally(console.log);
        } catch (error) {
            console.error(error);
        }
    }

    public getUser(): void {
        try {
            this.api.getUser()
                .then(async({ data, status }) => {
                    if (status === 200) {
                        store.set("user", data);

                        Router.go(RouterPath.profile);
                    } else {
                        console.error(status, " запрос на юзера не 200");
                    }
                })
                .catch(answer => answer)
                .finally(console.log);
        } catch (problems) {
            console.error("запрос на юзера не отработал: ", problems);
        }
    }

    public logout(): void {
        try {
            this.api.logout()
                .then((answer) => answer)
                .catch(answer => answer)
                .finally(console.log);

            store.set("user", undefined);

            Router.go(RouterPath.default);
        } catch (error) {
            console.error(error);
        }
    }
}

const controller = new AuthController();

export { controller };
