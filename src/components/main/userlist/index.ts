import { Info } from "../../blocks/Info";
import { Container } from "../../blocks/container";
import { Button } from "../../buttons";
import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface ChatProps extends IComponentProps {
    value: Array<{
        name: string;
        imageUrl: string;
        active: boolean;
    }>;
};

export class UserList extends Component<ChatProps> {
    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Container({
                    children: [
                        ...this.props.value.map(({ name, imageUrl, active }) => {
                            const className = active ? "user-chat-item-active" : "user-chat-item";

                            return new Button({ children: name, className });
                        })
                    ],
                    className: "user-chat-items"
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
