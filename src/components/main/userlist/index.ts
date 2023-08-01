import { controller } from "../../../controllers";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Container } from "../../blocks/container";
import { Button } from "../../buttons";
import { NewUser } from "./NewUser";

interface ChatProps extends IComponentProps {
    value?: Array<{ id: string | null; title: string | null }>;
    activeId?: string;
};

class UserList extends Component<ChatProps> {
    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new Container({
                    children: [
                        new NewUser({
                            value: {
                                title: ""
                            }
                        }),
                        ...((this.props.value ?? []).map(({
                            id, title
                        }) => {
                            const className = id === this.props.activeId ? "user-chat-item" : "user-chat-item-active";

                            return new Button({
                                children: `${title ?? "-"} id:${id ?? "-"}`,
                                className,
                                onclick: this.handleChange.bind(this, id)
                            });
                        })),
                        new Button({
                            children: `обновить чаты`,
                            onclick: this.handleUpdateUserList.bind(this)
                        })
                    ],
                    className: "user-chat-items"
                })
            ],
            className: "chat"
        });
    }

    protected handleChange(newActiveId: string, event: InputEvent): void {
        event.preventDefault();

        this.setProps({ activeId: newActiveId });
    }

    protected handleUpdateUserList(): void {
        store.set("chats", null);
        controller.getChats();
    }
}

export default withStore((state: any) => {
    return { value: state.chats || [] };
})(UserList);
