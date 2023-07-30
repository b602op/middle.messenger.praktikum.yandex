import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType, type PasswordFormFields } from "./types";

export interface PasswordFormProps extends IComponentProps {
    value: PasswordFormFields;
    errors?: Partial<PasswordFormFields>;
}

export class PasswordForm extends Component<PasswordFormProps> {
    constructor({
        value, errors
    }: PasswordFormProps) {
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
                    children: "текущий пароль",
                    value: this.props.value.password ?? "",
                    name: "password",
                    onChange: this.handleChange.bind(this, "password"),
                    placeholder: "текущий пароль",
                    error: this.props.errors?.password
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value.newPassword ?? "",
                    name: "newPassword",
                    onChange: this.handleChange.bind(this, "newPassword"),
                    placeholder: "новый пароль",
                    error: this.props.errors?.newPassword
                }),
                new Input({
                    children: "пароль (ещё раз)",
                    value: this.props.value.newPassword2 ?? "",
                    name: "newPassword2",
                    onChange: this.handleChange.bind(this),
                    placeholder: "новый пароль"
                }),
                new Button({
                    children: "изменить пароль",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleChange(key: keyof PasswordFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<PasswordFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof PasswordFormFields>;

        const { newErrors, success, newValue } = validationFields<PasswordFormFields>(keys, this.props.value);

        if (success) {
            console.log(newValue, " можно отправлять");

            return;
        }

        this.setProps({
            ...this.props,
            errors: newErrors
        });
    }
}
