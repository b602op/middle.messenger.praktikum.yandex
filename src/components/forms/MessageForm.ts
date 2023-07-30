import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { Container } from "../blocks/container";
import { validationFields } from "./helpers";
import { Component, type IComponentProps } from "../../core/component";
import { type FieldType, type MessageFormFields } from "./types";
export interface MessageFormProps extends IComponentProps {
    value: MessageFormFields;
    errors?: Partial<MessageFormFields>;
}

export class MessageForm extends Component<MessageFormProps> {
    constructor({
        value, errors
    }: MessageFormProps) {
        super({
            value,
            errors
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: new Container({
                children: [
                    new Input({
                        value: this.props.value.message ?? "",
                        name: "message",
                        placeholder: this.props.errors?.message ?? "новое сообщение",
                        className: "chat-input",
                        onChange: this.handleChange.bind(this)
                    }),
                    new Button({
                        children: "отправить",
                        onclick: this.handleFormSubmit.bind(this, "message")
                    })
                ],
                className: "chat-input-container"
            })
        });
    }

    protected handleChange(key: keyof MessageFormFields, event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const { newValue, newErrors } = validationFields<MessageFormFields>(key, { ...this.props.value, [key]: target.value });

        this.setProps({
            ...this.props,
            value: { ...this.props.value, ...newValue },
            errors: { ...this.props.errors, ...newErrors }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const keys: FieldType[] = Object.keys(this.props.value) as Array<keyof MessageFormFields>;

        const { newErrors, success, newValue } = validationFields<MessageFormFields>(keys, this.props.value);

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
