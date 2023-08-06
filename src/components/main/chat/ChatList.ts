import { controller } from "../../../controllers";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import socket from "../../../core/socket";
import { Info } from "../../blocks/Info";
import { Container, ContainerRow } from "../../blocks/container";
import { Button } from "../../buttons";
import { NewChat } from "./NewChat";

interface ChatProps extends IComponentProps {
    value?: Array<{ id: string | null; title: string | null }>;
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
                        ...((this.props.value ?? []).map(({
                            id, title
                        }) => {
                            const className = Number(id) === this.props.activeId ? "user-chat-item" : "user-chat-item-active";

                            return new ContainerRow({
                                children: [
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
                        })),
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

    protected handleRemoveChat(newActiveId: number, event: InputEvent): void {
        event.preventDefault();

        controller.removeChat(newActiveId);
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
