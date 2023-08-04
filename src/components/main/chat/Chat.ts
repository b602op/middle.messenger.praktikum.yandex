import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Info } from "../../blocks/Info";
import { Container } from "../../blocks/container";
import { MessageForm } from "../../forms";

interface ChatProps extends IComponentProps {
    value: Array<{
        message: string;
        self: boolean;
    }>;
};

class Chat extends Component<ChatProps> {
    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Container({
                    children: [
                        ...this.props.value.map(({ message, self }) => {
                            const className = self ? "chat-item-self" : "chat-item-noself";

                            return new Info({
                                tag: "span",
                                children: message,
                                className
                            });
                        })
                    ],
                    className: "chat-items"
                }),
                new MessageForm({ value: { message: null } })
            ],
            className: "chat"
        });
    }
}

export default withStore(state => {
    console.log(state);
    return {
        value: (state.messages ?? []).map((props) => {
            console.log(props, " props");

            const { content, user_id: userId } = props;

            return ({
                message: content,
                self: (userId === state?.user?.id)
            });
        })
    };
})(Chat);
