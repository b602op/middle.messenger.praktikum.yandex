import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType, type AuthorizationFormFields } from "./types";
import { controller } from "../../controllers";

export interface AuthorizationFormProps extends IComponentProps {
    value: AuthorizationFormFields;
    errors?: Partial<AuthorizationFormFields>;
}

export class AuthorizationForm extends Component<AuthorizationFormProps> {
    constructor({
        value, errors
    }: AuthorizationFormProps) {
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
                    children: "логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onChange: this.handleChange.bind(this, "login"),
                    placeholder: "login",
                    error: this.props.errors?.login
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
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

    protected handleChange(key: keyof AuthorizationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<AuthorizationFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof AuthorizationFormFields>;

        const { newErrors, success, newValue } = validationFields<AuthorizationFormFields>(keys, this.props.value);

        if (success) {
            controller.signIn({
                login: newValue.login ?? "",
                password: newValue.password ?? ""
            });

            return;
        }

        this.setProps({
            ...this.props,
            errors: newErrors
        });
    }
}
