import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";

interface ValueType { login: string | null; password: string | null };
export interface AuthorizationFormProps extends IComponentProps {
    value: ValueType;
}

export class AuthorizationForm extends Component<AuthorizationFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "login"
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "password"
                }),
                new Button({
                    onclick: this.handleFormSubmit.bind(this),
                    children: "войти"
                })
            ]
        });
    }

    protected handleChange(key: keyof ValueType, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({
            value: { ...this.props.value, [key]: target.value }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        console.log(this.props.value, " - Authorization Data");
    }
}
