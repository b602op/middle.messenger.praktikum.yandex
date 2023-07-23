import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationValue } from "./helpers";

interface UserFormFields {
    email: string | null;
    login: string | null;
    firstName: string | null;
    displayName: string | null;
    secondName: string | null;
    phone: string | null;
    password: string | null;
};

export interface UserFormProps extends IComponentProps {
    value: UserFormFields;
    errors: Record<keyof UserFormFields, string | null>;
}

export class UserForm extends Component<UserFormProps> {
    constructor({
        value
    }: UserFormProps) {
        super({
            value,
            errors: {
                email: null,
                login: null,
                firstName: null,
                displayName: null,
                secondName: null,
                phone: null,
                password: null
            }
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "Почта",
                    value: this.props.value.email ?? "",
                    name: "email",
                    onChange: this.handleChange.bind(this, "email"),
                    placeholder: "Почта",
                    error: this.props.errors.email
                }),
                new Input({
                    children: "Логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "Логин",
                    error: this.props.errors.login
                }),
                new Input({
                    children: "Имя",
                    value: this.props.value.firstName ?? "",
                    name: "name",
                    onChange: this.handleChange.bind(this, "firstName"),
                    placeholder: "Имя",
                    error: this.props.errors.firstName
                }),
                new Input({
                    children: "Имя в чате",
                    value: this.props.value.displayName ?? "",
                    name: "display_name",
                    onChange: this.handleChange.bind(this, "displayName"),
                    placeholder: "Имя в чате",
                    error: this.props.errors.displayName
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.secondName ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "secondName"),
                    placeholder: "Фамилия",
                    error: this.props.errors.secondName
                }),
                new Input({
                    children: "Телефон",
                    value: this.props.value.phone ?? "",
                    name: "phone",
                    onChange: this.handleChange.bind(this, "phone"),
                    placeholder: "Телефон",
                    error: this.props.errors.phone
                }),
                new Input({
                    children: "Пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "Пароль",
                    error: this.props.errors.password
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

        if (target.value === this.props.value.password) return;

        target.value = "";

        this.setProps({
            ...this.props,
            value: { ...this.props.value, password: null },
            errors: { ...this.props.errors, password: "повторный пароль не совпадает" }
        });
    }

    protected handleChange(key: keyof UserFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const [isError, currentValue] = validationValue(target.value, key);

        if (isError) {
            this.setProps({
                ...this.props,
                value: { ...this.props.value, [key]: null },
                errors: { ...this.props.errors, [key]: currentValue }
            });

            return;
        }

        this.setProps({
            ...this.props,
            value: { ...this.props.value, [key]: target.value }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const newErrors = { ...this.props.errors };

        Object.keys(this.props.errors).forEach((currentKey: keyof UserFormFields) => {
            const [isError, value] = validationValue(this.props.errors[currentKey] ?? "", currentKey);

            newErrors[currentKey] = isError ? value : null;
        });

        this.setProps({
            ...this.props,
            errors: newErrors
        });

        console.log(this.props.value, " - User Data");
    }
}
