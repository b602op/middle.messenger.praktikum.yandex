import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type AuthorizationFormFields } from "./types";
import { controller } from "../../controllers";
import Router, { RouterPath } from "../../core/Router";

export interface AuthorizationFormProps extends IComponentProps {
    login?: string | null;
    password?: string | null;
    errors?: Partial<AuthorizationFormFields>;
}

export class AuthorizationForm extends Component<AuthorizationFormProps> {
    constructor({
        login,
        password,
        errors
    }: AuthorizationFormProps) {
        super({
            login,
            password,
            errors
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "логин",
                    value: this.props.login ?? "",
                    name: "login",
                    onkeypress: this.handleOnKeyPress.bind(this, "login"),
                    onchange: this.handleOnKeyPress.bind(this, "login"),
                    placeholder: "login",
                    error: this.props.errors?.login
                }),
                new Input({
                    children: "пароль",
                    value: this.props.password ?? "",
                    name: "password",
                    onkeypress: this.handleOnKeyPress.bind(this, "password"),
                    onchange: this.handleOnKeyPress.bind(this, "password"),
                    placeholder: "password",
                    error: this.props.errors?.password
                }),
                new Button({
                    onclick: this.handleFormSubmit.bind(this),
                    children: "войти"
                })
            ]
        });
    }

    protected defaultValue: AuthorizationFormFields = {
        login: this.props.errors?.login ?? null,
        password: this.props.errors?.password ?? null
    };

    protected handleOnKeyPress(key: keyof AuthorizationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.defaultValue[key] = target.value;
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const currentData = {
            login: this.defaultValue.login ?? "",
            password: this.defaultValue.password ?? ""
        };

        controller.signIn(currentData, {
            good: () => { Router.go(RouterPath.profile); },
            bad: ({ status, data }: { status: number; data: { reason: string } }) => {
                this.setProps({
                    ...currentData,
                    errors: {
                        login: `статус ошибки ${status}`,
                        password: data?.reason
                    }
                });
            }
        });
    }
}
