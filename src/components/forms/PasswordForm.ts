import { controller } from "../../controllers";
import Router, { RouterPath } from "../../core/Router";
import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType, type PasswordFormFields } from "./types";

export interface PasswordFormProps extends IComponentProps {
    value?: PasswordFormFields;
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
                    value: this.props.value?.password ?? "",
                    name: "password",
                    onkeypress: this.handleOnPressKey.bind(this, "password"),
                    onchange: this.handleOnPressKey.bind(this, "password"),
                    placeholder: "текущий пароль",
                    error: this.props.errors?.password
                }),
                new Input({
                    children: "пароль",
                    value: this.props.value?.newPassword ?? "",
                    name: "newPassword",
                    onkeypress: this.handleOnPressKey.bind(this, "newPassword"),
                    onchange: this.handleOnPressKey.bind(this, "newPassword"),
                    placeholder: "новый пароль",
                    error: this.props.errors?.newPassword
                }),
                new Input({
                    children: "пароль (ещё раз)",
                    value: this.props.value?.newPassword2 ?? "",
                    name: "newPassword2",
                    onkeypress: this.handleOnPressKey.bind(this, "newPassword2"),
                    onchange: this.handleOnPressKey.bind(this, "newPassword2"),
                    placeholder: "новый пароль"
                }),
                new Button({
                    children: "изменить пароль",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    public defaultValue: PasswordFormFields = {
        password: this.props.value?.password ?? null,
        newPassword: this.props.value?.newPassword ?? null,
        newPassword2: this.props.value?.newPassword2 ?? null
    };

    protected handleOnPressKey(key: keyof PasswordFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.defaultValue[key] = target.value;
    }

    private handleFormSubmit(event: any): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.defaultValue) as Array<keyof PasswordFormFields>;

        const { newErrors, success, newValue } = validationFields<PasswordFormFields>(keys, this.defaultValue);

        if (success) {
            if (!newValue.password || !newValue.newPassword) return;

            controller.changePassword({
                oldPassword: newValue.password,
                newPassword: newValue.newPassword
            }, {
                good: () => { Router.go(RouterPath.profile); }
            });

            return;
        }

        this.setProps({
            value: this.defaultValue,
            errors: newErrors
        });
    }
}
