import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";
import { validationValue } from "./helpers";

export interface PasswordFormFields {
    password: string | null;
    newPassword: string | null;
};

export interface PasswordFormProps extends IComponentProps {
    value: PasswordFormFields;
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
                    name: "newPassword2",
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

        const isRepeated = target.value === this.props.value.password;

        if (!isRepeated && (target.value === this.props.value.newPassword)) {
            console.log("повторный пароль корректен");
            return;
        }

        if (isRepeated) {
            console.log("придумайте другой пароль");
        } else {
            console.log("повторный пароль не корректен");
        }

        target.value = "";

        this.setProps({
            value: { ...this.props.value, newPassword: null }
        });
    }

    protected handleChange(key: keyof PasswordFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const currentValue = validationValue(target.value, key);

        this.setProps({
            value: { ...this.props.value, [key]: currentValue }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        console.log(this.props.value, " - Password Data");
    }
}
