import { AuthAPI, type ISignInData, type ISignUpData } from "../api/AuthAPI";
import Router from "../core/Router";
import store from "../core/Store";

class AuthController {
    private readonly api = new AuthAPI();

    async signin(data: ISignInData): Promise<void> {
        try {
            await this.api.signin(data);

            await this.fetchUser();

            Router.go("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    async signup(data: ISignUpData): Promise<void> {
        try {
            await this.api.signup(data);

            Router.go("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.logout();

            store.set("user", undefined);

            Router.go("/");
        } catch (error) {
            console.log(error);
        }
    }

    async fetchUser(): Promise<void> {
        const user = await this.api.getUser();

        store.set("user", user);
    }
}

export default new AuthController();
