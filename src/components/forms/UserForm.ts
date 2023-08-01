import { withStore } from "../../core/Store/hook";
import { Component, type IComponentProps } from "../../core/component";
import { Image } from "../blocks";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType } from "./types";
import { type UserFormFields } from "./types/fields";

export interface UserFormProps extends IComponentProps {
    value: UserFormFields;
    errors?: Partial<UserFormFields>;
}

const defaultUser: UserFormFields = {
    avatar: null,
    display_name: null,
    first_name: null,
    id: null,
    login: null,
    second_name: null,
    password: null,
    password2: null
    // login: null,
    // display_name: null,
    // secondName: null,
    // phone: null,
    // password: null,
    // firstName: null
};

class UserForm extends Component<UserFormProps> {
    constructor({
        errors, value
    }: UserFormProps) {
        super({
            errors, value
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Image({
                    value: this.props.value.avatar ?? "",
                    title: "avatar"
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
                    name: "name",
                    onChange: this.handleChange.bind(this, "firstName"),
                    placeholder: "Имя",
                    error: this.props.errors?.first_name
                }),
                new Input({
                    children: "Имя в чате",
                    value: this.props.value.display_name ?? "",
                    name: "display_name",
                    onChange: this.handleChange.bind(this, "displayName"),
                    placeholder: "Имя в чате",
                    error: this.props.errors?.display_name
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.second_name ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "secondName"),
                    placeholder: "Фамилия",
                    error: this.props.errors?.second_name
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
                    value: "",
                    name: "password2",
                    onChange: this.handleChange.bind(this),
                    placeholder: "Пароль",
                    error: this.props.errors?.password2
                }),
                new Button({
                    children: "изменить данные",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleChange(key: keyof UserFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<UserFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof UserFormFields>;

        const { newErrors, success, newValue } = validationFields<UserFormFields>(keys, this.props.value);

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

export default withStore((state) => {
    return { value: { ...defaultUser, ...state.user } };
})(UserForm);
