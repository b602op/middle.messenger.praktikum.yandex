import { Info } from "../../blocks/Info";
import { Container } from "../../blocks/container";
import { Button } from "../../buttons";
import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";
import { Input } from "../../inputs";

interface ChatProps extends IComponentProps {
    value: Array<{
        massage: string;
        self: boolean;
    }>;
};

export class Chat extends Component<ChatProps> {
    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Container({
                    children: [
                        ...this.props.value.map(({ massage, self }) => {
                            const className = self ? "chat-item-self" : "chat-item-noself";

                            return new Info({ tag: "span", children: massage, className });
                        })
                    ],
                    className: "chat-items"
                }),
                new Container({
                    children: [
                        new Input({ value: "", name: "massage", placeholder: "новое сообщение", className: "chatinput" }),
                        new Button({ children: "отправить" })
                    ],
                    className: "chat-input"
                })
            ],
            className: "chat"
        });
    }

    private handleCancel(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/";
    }

    private handleToRegistration(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/registration";
    }
}
