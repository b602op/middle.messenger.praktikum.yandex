import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";

interface ValueType {
    email: string | null;
    login: string | null;
    name: string | null;
    second_name: string | null;
    phone: string | null;
    password: string | null;
};

export interface UserFormProps extends IComponentProps {
    value: ValueType;
}

export class UserForm extends Component<UserFormProps> {
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
                    value: this.props.value.name ?? "",
                    name: "name",
                    onChange: this.handleChange.bind(this, "name"),
                    placeholder: "Имя"
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.second_name ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "second_name"),
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
                    children: "изменить данные",
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

        console.log(this.props.value, " - User Data");
    }
}
