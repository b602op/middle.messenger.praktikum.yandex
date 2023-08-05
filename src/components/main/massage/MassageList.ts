import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Info } from "../../blocks/Info";
import { ContainerColumn } from "../../blocks/container";

interface MessageListProps extends IComponentProps {
    value: Array<{
        message: string;
        self: boolean;
        author: string;
    }>;
};

class MessageList extends Component<MessageListProps> {
    constructor({ value }: MessageListProps) {
        super({ value });
    }

    public getMassages(): Component | Component[] {
        const messages = this.props.value;

        if (!messages?.length) {
            return (
                new Info({
                    tag: "span",
                    children: "нет инфомрации о сообщениях"
                })
            );
        }

        const massageList = messages.map((props) => {
            const { message, self, author } = props;

            const className = self ? "massage-item-self" : "massage-item-no-self";

            return new Info({
                tag: "span",
                children: `${author}: ${message}`,
                className
            });
        });

        return massageList;
    }

    protected render(): Component | Component[] {
        return new ContainerColumn({
            children: this.getMassages(),
            className: "massage-list"
        });
    }
}

export default withStore(state => {
    const { user, messages = [], userList, activeChatId } = state;

    return {
        value: messages.map((props) => {
            const { content, user_id: userId } = props;

            let author = `id${userId}`;

            if (activeChatId) {
                const arr = userList?.[activeChatId];

                const { display_name: displayName } = arr?.find(({ id }) => id === userId) ?? {};

                if (displayName) author = displayName;
            }

            return ({
                message: content,
                author,
                self: (userId === user?.id)
            });
        })
    };
})(MessageList);
