import { controller } from "../../controllers";
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
                    value: this.props.value.avatar ? `https://ya-praktikum.tech/api/v2/resources${this.props.value.avatar}` : "",
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
                    onChange: this.handleChange.bind(this, "first_name"),
                    placeholder: "Имя",
                    error: this.props.errors?.first_name
                }),
                new Input({
                    children: "Имя в чате",
                    value: this.props.value.display_name ?? "",
                    name: "display_name",
                    onChange: this.handleChange.bind(this, "display_name"),
                    placeholder: "Имя в чате",
                    error: this.props.errors?.display_name
                }),
                new Input({
                    children: "Почта",
                    value: this.props.value.email ?? "",
                    name: "email",
                    onChange: this.handleChange.bind(this, "email"),
                    placeholder: "Почта",
                    error: this.props.errors?.email
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.second_name ?? "",
                    name: "second_name",
                    onChange: this.handleChange.bind(this, "secondName"),
                    placeholder: "Фамилия",
                    error: this.props.errors?.second_name
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
            const test: Omit<UserFormFields, "id" | "avatar" | "password"> = {
                first_name: newValue.first_name ?? "",
                second_name: newValue.second_name ?? "",
                display_name: newValue.display_name ?? "",
                email: newValue.email ?? "",
                phone: newValue.phone ?? "",
                login: newValue.login ?? ""
            };

            controller.changeProfile(test);

            return;
        }

        this.setProps({
            ...this.props,
            errors: newErrors
        });
    }
}

export default withStore((state) => {
    const {
        avatar = null,
        display_name: displayName = null,
        first_name: firstName = null,
        id = null,
        login = null,
        second_name: secondName = null,
        email = null,
        phone = null
    } = state.user ?? {};

    console.log(state, " state");

    return {
        value: {
            avatar,
            display_name: displayName,
            first_name: firstName,
            id,
            login,
            second_name: secondName,
            email,
            phone
        }
    };
})(UserForm);
