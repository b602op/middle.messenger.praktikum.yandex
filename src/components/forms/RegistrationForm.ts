import { Button } from "../buttons";
import { Component } from "../core";
import { type IComponentProps } from "../core/component";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationValue } from "./helpers";

export interface RegistrationFormFields {
    email: string | null;
    login: string | null;
    firstName: string | null;
    secondName: string | null;
    phone: string | null;
    password: string | null;
};

export interface RegistrationFormProps extends IComponentProps {
    value: RegistrationFormFields;
}

export class RegistrationForm extends Component<RegistrationFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "Почта",
                    value: this.props.value.email ?? "",
                    name: "email",
                    onChange: this.handleChange.bind(this, "email"),
                    placeholder: "Почта"
                }),
                new Input({
                    children: "Логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "Логин"
                }),
                new Input({
                    children: "Имя",
                    value: this.props.value.firstName ?? "",
                    name: "first_name",
                    onChange: this.handleChange.bind(this, "firstName"),
                    placeholder: "Имя"
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.secondName ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "secondName"),
                    placeholder: "Фамилия"
                }),
                new Input({
                    children: "Телефон",
                    value: this.props.value.phone ?? "",
                    name: "phone",
                    onChange: this.handleChange.bind(this, "phone"),
                    placeholder: "Телефон"
                }),
                new Input({
                    children: "Пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "Пароль"
                }),
                new Input({
                    children: "Пароль(ещё раз)",
                    value: "",
                    name: "password2",
                    onChange: this.handleCheck.bind(this),
                    placeholder: "Пароль"
                }),
                new Button({
                    children: "регистрация",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleCheck(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        if (target.value === this.props.value.password) {
            console.log("повторный пароль корректен");
            return;
        }

        console.log("повторный пароль не корректен");

        target.value = "";

        this.setProps({
            value: { ...this.props.value, password: null }
        });
    }

    protected handleChange(key: keyof RegistrationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const currentValue = validationValue(target.value, key);

        this.setProps({
            value: { ...this.props.value, [key]: currentValue }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        console.log(this.props.value, " - Registration Data");
    }
}
