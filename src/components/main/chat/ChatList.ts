import { controller } from "../../../controllers";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import socket from "../../../core/socket";
import { Info } from "../../blocks/Info";
import { Container, ContainerColumn, ContainerRow } from "../../blocks/container";
import { ImageMin } from "../../blocks/image";
import { Button } from "../../buttons";
import { NewChat } from "./NewChat";

const defaultAvatarChat = "/345362ce-dd10-412e-a348-4daefa5bd42e/25b0e090-dbdc-4e39-8a25-9eae4e7e5a55_181548.png";

interface ChatProps extends IComponentProps {
    value?: Array<{
        id?: number | null;
        title?: string | null;
        avatar?: string | null;
        unread_count?: number | null;
    }>;
    activeId?: number | null;
};

class ChatList extends Component<ChatProps> {
    protected componentDidMount(): void {
        if (this.props.value === undefined) {
            store.set("chats", null);
            store.set("activeChatId", null);
            controller.getChats();
        }
    }

    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected getChats(): Component | null {
        const chats = this.props.value;

        if (!chats) {
            return null;
        }

        const currentChats = chats.map(({
            id, title, unread_count: unreadMessageCount, avatar
        }) => {
            const className = Number(id) === this.props.activeId ? "user-chat-item" : "user-chat-item-active";

            const infoUnreadMessage = unreadMessageCount
                ? (
                    new Info({
                        children: `Не прочитанных: ${unreadMessageCount}`,
                        tag: "span"
                    })
                )
                : null;

            const infoChat = new ContainerRow({
                children: [
                    new ImageMin({
                        value: avatar,
                        defaultValue: defaultAvatarChat
                    }),
                    new Button({
                        children: `${title ?? "-"} id:${id ?? "-"}`,
                        className,
                        onclick: this.handleChange.bind(this, id)
                    }),
                    new Button({
                        children: "🗑",
                        className: "delete-button",
                        onclick: this.handleRemoveChat.bind(this, id)
                    })
                ]
            });

            return new ContainerColumn({
                children: [
                    infoUnreadMessage,
                    infoChat
                ]
            });
        });

        return new ContainerColumn({
            children: currentChats
        });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Container({
                    children: [
                        new Info({
                            tag: "span",
                            children: "чаты"
                        }),
                        new NewChat({}),
                        this.getChats(),
                        new Button({
                            children: `обновить чаты`,
                            onclick: this.handleUpdateChatList.bind(this)
                        })
                    ],
                    className: "user-chat-items"
                })
            ],
            className: "chat"
        });
    }

    protected handleChange(newActiveId: number, event: InputEvent): void {
        event.preventDefault();

        this.setProps({ activeId: newActiveId });

        store.set("activeChatId", newActiveId);

        controller.getChatUser(newActiveId);

        socket.connect(newActiveId);
    }

    protected handleRemoveChat(deleteActiveId: number, event: InputEvent): void {
        event.preventDefault();

        const callbacks = {
            good: () => {
                if (deleteActiveId === this.props.activeId) store.set("activeChatId", null);

                this.setProps({
                    ...this.props,
                    value: this.props.value?.filter(({ id }) => id !== deleteActiveId)
                });
            }
        };

        controller.removeChat(deleteActiveId, callbacks);
    }

    protected handleUpdateChatList(): void {
        store.set("chats", null);
        store.set("activeChatId", null);

        this.setProps({ activeId: null });

        controller.getChats();
    }
}

export default withStore((state: any) => {
    const { chats } = state;

    return { value: chats };
})(ChatList);
