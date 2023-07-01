import { Info } from "../../blocks/Info";
import { Container } from "../../blocks/container";
import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";
import { MessageForm } from "../../forms";

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
                new MessageForm({ message: null })
            ],
            className: "chat"
        });
    }
}
