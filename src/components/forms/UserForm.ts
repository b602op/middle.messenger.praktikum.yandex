import { controller } from "../../controllers";
import { withStore } from "../../core/Store/hook";
import { Component, type IComponentProps } from "../../core/component";
import { Image } from "../blocks";
import { Info } from "../blocks/Info";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType } from "./types";
import { type UserFormFields } from "./types/fields";

export interface UserFormProps extends IComponentProps {
    value: Partial<UserFormFields>;
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
                    value: this.props.value.avatar,
                    title: "avatar"
                }),
                new Info({
                    tag: "span",
                    children: `id: ${this.props.value.id ?? "-"} `
                }),
                new Input({
                    children: "Логин",
                    value: this.props.value.login ?? "",
                    name: "login",
                    onkeypress: this.handleOnKeyPress.bind(this, "login"),
                    placeholder: "Логин",
                    error: this.props.errors?.login
                }),
                new Input({
                    children: "Имя",
                    value: this.props.value.first_name ?? "",
                    name: "name",
                    onkeypress: this.handleOnKeyPress.bind(this, "first_name"),
                    placeholder: "Имя",
                    error: this.props.errors?.first_name
                }),
                new Input({
                    children: "Имя в чате",
                    value: this.props.value.display_name ?? "",
                    name: "display_name",
                    onkeypress: this.handleOnKeyPress.bind(this, "display_name"),
                    placeholder: "Имя в чате",
                    error: this.props.errors?.display_name
                }),
                new Input({
                    children: "Почта",
                    value: this.props.value.email ?? "",
                    name: "email",
                    onkeypress: this.handleOnKeyPress.bind(this, "email"),
                    placeholder: "Почта",
                    error: this.props.errors?.email
                }),
                new Input({
                    children: "Фамилия",
                    value: this.props.value.second_name ?? "",
                    name: "second_name",
                    onkeypress: this.handleOnKeyPress.bind(this, "secondName"),
                    placeholder: "Фамилия",
                    error: this.props.errors?.second_name
                }),
                new Input({
                    children: "Телефон",
                    value: this.props.value.phone ?? "",
                    name: "phone",
                    onkeypress: this.handleOnKeyPress.bind(this, "phone"),
                    placeholder: "Телефон",
                    error: this.props.errors?.phone
                }),
                new Button({
                    children: "изменить данные",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    public defaultValue: UserFormFields = {
        avatar: this.props.value.avatar ?? null,
        display_name: this.props.value.display_name ?? null,
        first_name: this.props.value.first_name ?? null,
        id: this.props.value.id ?? null,
        login: this.props.value.login ?? null,
        second_name: this.props.value.second_name ?? null,
        email: this.props.value.email ?? null,
        phone: this.props.value.phone ?? null
    };

    protected handleOnKeyPress(key: keyof UserFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.defaultValue[key] = target.value;
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.defaultValue) as Array<keyof UserFormFields>;

        const { newErrors, success, newValue } = validationFields<UserFormFields>(keys, this.defaultValue);

        if (success) {
            const profileData: Omit<UserFormFields, "id" | "avatar" | "password"> = {
                first_name: newValue.first_name ?? "",
                second_name: newValue.second_name ?? "",
                display_name: newValue.display_name ?? "",
                email: newValue.email ?? "",
                phone: newValue.phone ?? "",
                login: newValue.login ?? ""
            };

            controller.changeProfile(profileData);

            return;
        }

        this.setProps({
            ...this.props,
            value: newValue,
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
