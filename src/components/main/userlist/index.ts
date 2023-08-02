import { type IRemoveUsersFromChatData } from "../../../api/AuthAPI";
import { controller } from "../../../controllers";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Info } from "../../blocks/Info";
import { Container, ContainerColumn } from "../../blocks/container";
import SearchUser from "./AddUser";
import UserBlock from "./UserBlock";

interface ChatProps extends IComponentProps {
    value?: Array<{ id: string | null; title: string | null }>;
    activeId?: number | null;
};

class UserList extends Component<ChatProps> {
    constructor({ value }: ChatProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new ContainerColumn({
                    children: [
                        new Info({
                            tag: "span",
                            children: "пользователи чата"
                        }),
                        new SearchUser({})

                        // new Button({
                        //     children: `обновить чаты`,
                        //     onclick: this.handleUpdateUserList.bind(this)
                        // })
                    ],
                    className: "underline-container"
                }),
                ...((this.props.value ?? []).map(({ id, login, avatar, role }: any) => {
                    return new UserBlock({ id, login, avatar, role, removeUser: this.handleRemoveUser.bind(this) });
                }))
            ],
            className: "chat"
        });
    }

    protected handleChange(newActiveId: number, event: InputEvent): void {
        event.preventDefault();

        this.setProps({ activeId: newActiveId });
    }

    protected handleUpdateUserList(): void {
        store.set("chats", null);

        controller.getChats();
    }

    protected handleRemoveUser(users: Omit<IRemoveUsersFromChatData, "chatId">): void {
        const id = (store.getState() as any).activeChatId;

        if (id) {
            const data: IRemoveUsersFromChatData = { ...users, chatId: id };

            controller.removeUserFromChat(data);
        }
    }
}

export default withStore((state: any) => {
    const { activeChatId, userList } = state;

    return { value: userList ? userList[activeChatId] : [], activeChatId: activeChatId || null };
})(UserList);
