import { AuthAPI } from "../../api/AuthAPI";
import Router from "../../core/Router";
import store from "../../core/Store";

export interface ISignUpRequestData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface ISignUpResponseData {
    id: number;
}

export interface ISignUpResponseError {
    reason: string;
}

export class SignUpController {
    private readonly api = new AuthAPI();

    public signUp(data: ISignUpRequestData): void {
        store.set("signup.loading", true);
        store.set("signup.errors", null);

        // signUpValidator.validate(data);

        // if (!signUpValidator.isValid) {
        //     store.set("signup.errors", signUpValidator.errors);
        // }

        this.api.signup<ISignUpResponseData>(data).then(response => {
            const { status, data } = response;

            switch (status) {
                case 200: {
                    store.set("user.data.id", data.id);
                    Router.go("/");
                    break;
                }
                case 400: {
                    console.error("Bad request", response);
                    break;
                }
                case 401: {
                    Router.go("/signin/");
                    break;
                }
                case 409: {
                    // store.set("signup.errors", {
                    //     "Conflict Error": [response.data.reason]
                    // });
                    console.error("Bad request", response);
                    break;
                }
                case 500: {
                    Router.go("/server-error/");
                    break;
                }
                default: {
                    throw new Error(`Необработанный код ответа ${response.status}`);
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            store.set("signup.loading", false);
        });
    }
}

export default new SignUpController();
