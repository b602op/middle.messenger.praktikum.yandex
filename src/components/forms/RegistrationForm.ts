import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationValue } from "./helpers";
import signUpController from "../../controllers/sign-up-controller";

export interface RegistrationFormFields {
    name: string | null;
    email: string | null;
    login: string | null;
    displayName: string | null;
    firstName: string | null;
    secondName: string | null;
    phone: string | null;
    password: string | null;
};

export interface RegistrationFormProps extends IComponentProps {
    value: RegistrationFormFields;
    errors: Record<keyof RegistrationFormFields, string | null>;
    password2: string | null;
}

export class RegistrationForm extends Component<RegistrationFormProps> {
    constructor({
        value, errors, password2
    }: RegistrationFormProps) {
        super({
            value,
            errors,
            password2
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
                    name: "first_name",
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
                    value: this.props.password2 ?? "",
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
            this.setProps({
                ...this.props,
                password2: target.value
            });

            return;
        }

        this.setProps({
            ...this.props,
            value: { ...this.props.value, password: null },
            errors: { ...this.props.errors, password: "пароли не совпадают" }
        });
    }

    protected handleChange(key: keyof RegistrationFormFields, event: InputEvent): void {
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
            errors: { ...this.props.errors, [key]: null },
            value: { ...this.props.value, [key]: currentValue }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const newErrors = { ...this.props.errors };

        Object.keys(this.props.errors).forEach((currentKey: keyof RegistrationFormFields) => {
            const [isError, value] = validationValue(this.props.value[currentKey] ?? "", currentKey);

            newErrors[currentKey] = isError ? value : null;
        });

        this.setProps({
            ...this.props,
            errors: this.props.password2 ? newErrors : { ...newErrors, password: "пароли не совпадают" }
        });

        console.log(newErrors, Object.values(newErrors).filter(x => !x).length, this.props.password2);

        if (Object.values(newErrors).filter(x => !x).length && this.props.password2) {
            const data = {
                first_name: this.props.value.firstName ?? "",
                second_name: this.props.value.secondName ?? "",
                login: this.props.value.login ?? "",
                email: this.props.value.email ?? "",
                password: this.props.value.password ?? "",
                phone: this.props.value.phone ?? ""
            };

            signUpController.signUp(data);
        }
    }
}
