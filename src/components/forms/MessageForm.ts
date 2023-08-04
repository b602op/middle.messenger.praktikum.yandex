import { Button } from "../buttons";
import { Input } from "../inputs";
import { Container } from "../blocks/container";
import { Component, type IComponentProps } from "../../core/component";
import socket from "../../core/socket";
export interface MessageFormProps extends IComponentProps {
    text?: string;
}

export class MessageForm extends Component<MessageFormProps> {
    constructor({
        text
    }: MessageFormProps) {
        super({ text });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Input({
                    value: this.props.text ?? "",
                    name: "message",
                    placeholder: "новое сообщение",
                    className: "chat-input",
                    onChange: this.handleChange.bind(this)
                }),
                new Button({
                    children: "отправить",
                    onclick: this.sendMassage.bind(this),
                    disable: !this.props.text
                })
            ],
            className: "chat-input-container"
        });
    }

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        const text = target.value;

        if (!text) return;

        this.setProps({ text });
    }

    private sendMassage(event: SubmitEvent): void {
        event.preventDefault();

        const message = this.props.text;

        if (message) {
            socket.sendMessage(message);
        }
    }
}

export default MessageForm;
