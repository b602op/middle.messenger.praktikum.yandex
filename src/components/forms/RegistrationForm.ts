import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { controller } from "../../controllers";
import { type FieldType, type RegistrationFormFields } from "./types";
import Router, { RouterPath } from "../../core/Router";
import { ContainerColumn, ContainerRow } from "../blocks/container";

export interface RegistrationFormProps extends IComponentProps {
    value?: RegistrationFormFields;
    errors?: Partial<RegistrationFormFields>;
}

const ABC = "abcdefghijklmnopqrstuvwxyz";

const emptyFields = {
    first_name: null,
    second_name: null,
    login: null,
    email: null,
    password: null,
    phone: null
};

const getRandomText = (): RegistrationFormFields => {
    let text = "";
    let number = "";

    for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * 26);

        number += String(index);

        text += !i ? ABC[index].toLocaleUpperCase() : ABC[index];
    }

    text += String(Math.floor(Math.random() * (9000)) + 1000);

    return {
        first_name: text,
        second_name: text,
        login: text,
        email: `${text}@mail.ru`,
        password: `${text}${text}`,
        password2: `${text}${text}`,
        phone: `+7911${number}`
    };
};

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
                new ContainerRow({
                    children: [
                        new ContainerColumn({
                            children: [
                                new Input({
                                    children: "Имя",
                                    value: this.props.value?.first_name ?? "",
                                    name: "first_name",
                                    onchange: this.handleChange.bind(this, "first_name"),
                                    placeholder: "Имя",
                                    error: this.props.errors?.first_name
                                }),
                                new Input({
                                    children: "Фамилия",
                                    value: this.props.value?.second_name ?? "",
                                    name: "second_name",
                                    onchange: this.handleChange.bind(this, "second_name"),
                                    placeholder: "Фамилия",
                                    error: this.props.errors?.second_name
                                }),
                                new Input({
                                    children: "Логин",
                                    value: this.props.value?.login ?? "",
                                    name: "login",
                                    onchange: this.handleChange.bind(this, "login"),
                                    placeholder: "Логин",
                                    error: this.props.errors?.login
                                }),
                                new Input({
                                    children: "Почта",
                                    value: this.props.value?.email ?? "",
                                    name: "email",
                                    onchange: this.handleChange.bind(this, "email"),
                                    placeholder: "Почта",
                                    error: this.props.errors?.email
                                }),
                                new Input({
                                    children: "Телефон",
                                    value: this.props.value?.phone ?? "",
                                    name: "phone",
                                    onchange: this.handleChange.bind(this, "phone"),
                                    placeholder: "Телефон",
                                    error: this.props.errors?.phone
                                }),
                                new Input({
                                    children: "Пароль",
                                    value: this.props.value?.password ?? "",
                                    name: "password",
                                    onchange: this.handleChange.bind(this, "password"),
                                    placeholder: "Пароль",
                                    error: this.props.errors?.password
                                }),
                                new Input({
                                    children: "Пароль(ещё раз)",
                                    value: this.props.value?.password2 ?? "",
                                    name: "password2",
                                    onchange: this.handleChange.bind(this, "password2"),
                                    placeholder: "Пароль",
                                    error: this.props.errors?.password2
                                }),
                                new Button({
                                    children: "регистрация",
                                    onclick: this.handleFormSubmit.bind(this)
                                })
                            ]
                        }),
                        new ContainerColumn({
                            children: new Button({
                                children: "сгенерировать поля",
                                onclick: this.handleCreate.bind(this)
                            })
                        })
                    ]
                })

            ]
        });
    }

    protected handleChange(key: keyof RegistrationFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        console.log({ ...(this.props.value ?? {}), [key]: target.value });

        const { newValue, newErrors } = validationFields<any>(key, {
            [key]: target.value
        });

        this.setProps({
            value: {
                ...emptyFields,
                ...(this.props.value ?? {}),
                ...newValue
            },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    protected handleCreate(): void {
        const random = getRandomText();

        this.setProps({
            ...this.props,
            value: random
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(emptyFields) as Array<keyof RegistrationFormFields>;

        const { newErrors, success, newValue } = validationFields<RegistrationFormFields>(keys, this.props.value ?? emptyFields);

        const callbacks2 = {
            good: () => {
                controller.getUser({
                    good: () => { Router.go(RouterPath.profile); }
                });
            }
        };

        const callbacks = {
            good: () => {
                if (!newValue.login || !newValue.password) return;

                controller.signIn({
                    login: newValue.login,
                    password: newValue.password
                }, callbacks2);
            }
        };

        if (success) {
            controller.signUp({
                first_name: newValue.first_name ?? "",
                second_name: newValue.second_name ?? "",
                login: newValue.login ?? "",
                email: newValue.email ?? "",
                password: newValue.password ?? "",
                phone: newValue.phone ?? ""
            }, callbacks);

            return;
        }

        this.setProps({
            ...this.props,
            errors: newErrors
        });
    }
}
