import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { Container } from "../blocks/container";
import { validationValue } from "./helpers";
import { Component, type IComponentProps } from "../../core/component";

export interface MessageFormProps extends IComponentProps {
    message: string | null;
    errors: Record<string, string | null>;
}

export class MessageForm extends Component<MessageFormProps> {
    constructor({
        message
    }: MessageFormProps) {
        super({
            message,
            errors: {
                message: null
            }
        });
    }

    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: new Container({
                children: [
                    new Input({
                        value: this.props.message ?? "",
                        name: "message",
                        placeholder: this.props.errors.message ?? "новое сообщение",
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

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({
            message: target.value,
            errors: { ...this.props.errors, message: null }
        });
    }

    private handleFormSubmit(key: keyof MessageFormProps, event: SubmitEvent): void {
        event.preventDefault();

        const [isError, currentValue] = validationValue(this.props.message ?? "", key);

        if (isError) {
            this.setProps({
                ...this.props,
                errors: { ...this.props.errors, message: currentValue }
            });

            console.log(this.props);

            return;
        }

        if (currentValue) console.log(currentValue, " - Message Data");
    }
}
