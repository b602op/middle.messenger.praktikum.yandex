import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";
import { Container } from "../blocks/container";
import { validationValue } from "./helpers";

export interface MessageFormProps extends IComponentProps {
    message: string | null;
}

export class MessageForm extends Component<MessageFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: new Container({
                children: [
                    new Input({
                        value: this.props.message ?? "",
                        name: "message",
                        placeholder: "новое сообщение",
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

        this.setProps({ message: target.value });
    }

    private handleFormSubmit(key: keyof MessageFormProps, event: SubmitEvent): void {
        event.preventDefault();

        const currentValue = validationValue(this.props.message ?? "", key);

        if (currentValue) console.log(currentValue, " - Message Data");
    }
}
