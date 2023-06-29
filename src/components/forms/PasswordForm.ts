import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";

interface ValueType {
    password: string | null;
    newPassword: string | null;
};

export interface PasswordFormProps extends IComponentProps {
    value: ValueType;
}

export class PasswordForm extends Component<PasswordFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "текущий пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "текущий пароль"
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value.newPassword ?? "",
                    name: "newPassword",
                    onChange: this.handleChange.bind(this, "newPassword"),
                    placeholder: "новый пароль"
                }),
                new Input({
                    children: "пароль (ещё раз)",
                    value: "",
                    name: "password",
                    onChange: this.handleCheck.bind(this),
                    placeholder: "новый пароль"
                }),
                new Button({
                    children: "изменить пароль",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleCheck(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        console.log(target.value, " - password check");
    }

    protected handleChange(key: keyof ValueType, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({
            value: { ...this.props.value, [key]: target.value }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        console.log(this.props.value, " - Password Data");
    }
}
