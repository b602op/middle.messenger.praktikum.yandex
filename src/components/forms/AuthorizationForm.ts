import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationValue } from "./helpers";

interface AuthorizationFormFields { login: string | null; password: string | null };
export interface AuthorizationFormProps extends IComponentProps {
    value: AuthorizationFormFields;
    errors?: Record<string, string | null>;
}

export class AuthorizationForm extends Component<AuthorizationFormProps> {
    constructor({
        value
    }: AuthorizationFormProps) {
        super({
            value,
            errors: {
                login: null,
                password: null
            }
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "login",
                    error: this.props.errors.login
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "password",
                    error: this.props.errors.password
                }),
                new Button({
                    onclick: this.handleFormSubmit.bind(this),
                    children: "войти"
                })
            ]
        });
    }

    protected handleChange(key: keyof AuthorizationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({
            ...this.props,
            value: { ...this.props.value, [key]: target.value }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const newErrors = { ...this.props.errors };

        Object.keys(this.props.errors).forEach((currentKey: keyof AuthorizationFormFields) => {
            const [isError] = validationValue(this.props.value[currentKey] ?? "", currentKey);

            newErrors[currentKey] = isError ? "некорректные данные" : null;
        });

        this.setProps({
            ...this.props,
            errors: newErrors
        });

        console.log(this.props.errors);

        console.log(this.props.value, " - Authorization Data");
    }
}
