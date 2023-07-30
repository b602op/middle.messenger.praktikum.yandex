import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { validationFields } from "./helpers";
import { type FieldType, type AvatarFormFields } from "./types";

export interface AvatarFormProps extends IComponentProps {
    value: AvatarFormFields;
    errors?: Partial<AvatarFormFields>;
}

export class AvatarForm extends Component<AvatarFormProps> {
    constructor({
        value, errors
    }: AvatarFormProps) {
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
                    children: "ссылка на аватарку",
                    value: this.props.value.avatar ?? "",
                    name: "avatar",
                    onChange: this.handleChange.bind(this),
                    placeholder: "url",
                    error: this.props.errors?.avatar
                }),
                new Button({
                    children: "отправить",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleChange(key: keyof AvatarFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<AvatarFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof AvatarFormFields>;

        const { newErrors, success, newValue } = validationFields<AvatarFormFields>(keys, this.props.value);

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
