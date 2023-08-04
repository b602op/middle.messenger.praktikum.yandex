import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { controller } from "../../controllers";
import { type FieldType, type RegistrationFormFields } from "./types";

export interface RegistrationFormProps extends IComponentProps {
    value: RegistrationFormFields;
    errors?: Partial<RegistrationFormFields>;
}

export class RegistrationForm extends Component<RegistrationFormProps> {
    constructor({
        value, errors
    }: RegistrationFormProps) {
        super({
            value,
            errors
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
                    error: this.props.errors?.email
                }),
                new Input({
                    children: "Логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "Логин",
                    error: this.props.errors?.login
                }),
                new Input({
                    children: "Имя",
                    value: this.props.value.first_name ?? "",
                    name: "first_name",
                    onChange: this.handleChange.bind(this, "first_name"),
                    placeholder: "Имя",
                    error: this.props.errors?.first_name
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.second_name ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "second_name"),
                    placeholder: "Фамилия",
                    error: this.props.errors?.second_name
                }),
                new Input({
                    children: "Телефон",
                    value: this.props.value.phone ?? "",
                    name: "phone",
                    onChange: this.handleChange.bind(this, "phone"),
                    placeholder: "Телефон",
                    error: this.props.errors?.phone
                }),
                new Input({
                    children: "Пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "Пароль",
                    error: this.props.errors?.password
                }),
                new Input({
                    children: "Пароль(ещё раз)",
                    value: this.props.value.password2 ?? "",
                    name: "password2",
                    onChange: this.handleChange.bind(this, "password2"),
                    placeholder: "Пароль",
                    error: this.props.errors?.password2
                }),
                new Button({
                    children: "регистрация",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleChange(key: keyof RegistrationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<RegistrationFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof RegistrationFormFields>;

        const { newErrors, success, newValue } = validationFields<RegistrationFormFields>(keys, this.props.value);

        if (success) {
            controller.signUp({
                first_name: newValue.first_name ?? "",
                second_name: newValue.second_name ?? "",
                login: newValue.login ?? "",
                email: newValue.email ?? "",
                password: newValue.password ?? "",
                phone: newValue.phone ?? ""
            });

            controller.getUser();
            return;
        }

        this.setProps({
            ...this.props,
            errors: newErrors
        });
    }
}
