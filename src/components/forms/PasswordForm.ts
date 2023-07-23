import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationValue } from "./helpers";

export interface PasswordFormFields {
    password?: string | null;
    newPassword?: string | null;
};

export interface PasswordFormProps extends IComponentProps {
    value: PasswordFormFields;
    errors: Record<keyof PasswordFormFields, string | null | undefined>;
    newPassword2: string | null;
}

export class PasswordForm extends Component<PasswordFormProps> {
    constructor({
        value
    }: PasswordFormProps) {
        super({
            value,
            errors: {
                password: null,
                newPassword: null
            },
            newPassword2: null
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
                    value: this.props.newPassword2 ?? "",
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

        console.log(target.value, this.props.value.password);

        if (!isRepeated && (target.value === this.props.value.newPassword)) {
            this.setProps({
                ...this.props,
                newPassword2: target.value
            });

            return;
        }

        let passwordError;

        if (isRepeated) {
            passwordError = "придумайте другой пароль";
        } else {
            passwordError = "повторный пароль не корректен";
        }

        this.setProps({
            ...this.props,
            value: { ...this.props.value, newPassword: null },
            errors: { ...this.props.errors, newPassword: passwordError },
            newPassword2: null
        });
    }

    protected handleChange(key: keyof PasswordFormFields, event: InputEvent): void {
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
            value: { ...this.props.value, [key]: currentValue },
            errors: { ...this.props.errors, [key]: null }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const newErrors = { ...this.props.errors };

        Object.keys(this.props.errors).forEach((currentKey: keyof PasswordFormFields) => {
            const [isError, value] = validationValue(this.props.value[currentKey] ?? "", currentKey);

            newErrors[currentKey] = isError ? value : null;
        });

        console.log(newErrors, " newErrors");

        this.setProps({
            ...this.props,
            errors: newErrors
        });

        console.log(this.props.value, " - Password Data");
    }
}
