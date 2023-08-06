import { controller } from "../../controllers";
import { Component, type IComponentProps } from "../../core/component";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type AvatarFormFields } from "./types";

export interface AvatarFormProps extends IComponentProps {
    value: AvatarFormFields;
    errors?: Partial<AvatarFormFields>;
    file?: any;
}

export class AvatarForm extends Component<AvatarFormProps> {
    constructor({
        value, errors, file
    }: AvatarFormProps) {
        super({
            value,
            errors,
            file
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "загрузите файл с аватаркой",
                    value: this.props.value.avatar ?? "",
                    name: "avatar",
                    onchange: this.handleChange.bind(this, "avatar"),
                    placeholder: "url",
                    error: this.props.errors?.avatar,
                    type: "file"
                }),
                new Button({
                    children: "отправить",
                    onclick: this.handleFormSubmit.bind(this),
                    disable: !this.props.file
                })
            ]
        });
    }

    protected handleChange(key: keyof AvatarFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const fileItem = target.files?.item(0);

        if (fileItem) {
            const file = new FormData();

            file.append("avatar", fileItem);

            this.setProps({
                ...this.props,
                file
            });
        }
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        if (this.props.file) {
            controller.setAvatar(this.props.file);

            this.setProps({
                ...this.props,
                file: null
            });
        }
    }
}
