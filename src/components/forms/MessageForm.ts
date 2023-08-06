import { Button } from "../buttons";
import { Input } from "../inputs";
import { Container } from "../blocks/container";
import { Component, type IComponentProps } from "../../core/component";
import socket from "../../core/socket";
import { withStore } from "../../core/Store/hook";
export interface MessageFormProps extends IComponentProps {
    text?: string;
    activeChatId?: number;
}

export class MessageForm extends Component<MessageFormProps> {
    constructor({
        text, activeChatId
    }: MessageFormProps) {
        super({ text, activeChatId });
    }

    protected defaultText = {
        text: this.props.text
    };

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Input({
                    value: "",
                    name: "message",
                    placeholder: "новое сообщение",
                    className: "chat-input",
                    onkeypress: this.handlePressKey.bind(this),
                    onchange: this.handleChange.bind(this)
                }),
                new Button({
                    children: "отправить",
                    onclick: this.sendMassage.bind(this),
                    disable: !this.props.activeChatId
                })
            ],
            className: "chat-input-container"
        });
    }

    protected handleChange(event: InputEvent): void {
        event.preventDefault();

        const target = event.target as HTMLInputElement;

        this.defaultText.text = target.value;
    }

    protected handlePressKey(props: any): void {
        const { key, target } = props;

        this.defaultText.text = target.value;

        if (key === "Enter") {
            this.sendMassage();
        }
    }

    private sendMassage(): void {
        const message = this.defaultText.text;

        if (!message) return;

        this.setProps({ text: message });

        socket.sendMessage(message);
    }
}

export default withStore(state => {
    const { activeChatId } = state;
    return { activeChatId };
})(MessageForm);
