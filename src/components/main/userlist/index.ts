import { type IRemoveUsersFromChatData } from "../../../api/AuthAPI";
import { controller } from "../../../controllers";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Info } from "../../blocks/Info";
import { Container, ContainerColumn } from "../../blocks/container";
import SearchUser from "./AddUser";
import UserBlock, { type UserInformation } from "./UserBlock";

interface ChatProps extends IComponentProps {
    value: UserInformation[];
    activeChatId: number | null;
};

class UserList extends Component<ChatProps> {
    constructor({ value, activeChatId }: ChatProps) {
        super({ value, activeChatId });
    }

    protected getUsers(): Component[] {
        console.log(this.props.activeChatId, " this.props.activeChatId?");
        if (!this.props.value?.length || !this.props.activeChatId) {
            return [];
        }

        const users = this.props.value.map((value: UserInformation) => (
            new UserBlock({ value, removeUser: this.handleRemoveUser.bind(this) })
        ));

        return [
            new Info({
                tag: "span",
                children: `пользователи ЧАТА - id:${this.props.activeChatId}`
            }),
            ...users
        ];
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new ContainerColumn({
                    children: new SearchUser({}),
                    className: "underline-container"
                }),
                ...this.getUsers()
            ],
            className: "chat"
        });
    }

    protected handleUpdateUserList(): void {
        store.set("chats", null);

        controller.getChats();
    }

    protected handleRemoveUser(users: Omit<IRemoveUsersFromChatData, "chatId">): void {
        if (this.props.activeChatId) {
            const data: IRemoveUsersFromChatData = { ...users, chatId: this.props.activeChatId };

            controller.removeUserFromChat(data);
        }
    }
}

export default withStore((state: any) => {
    const { activeChatId, userList } = state;

    console.log(state, " state");

    return { value: userList ? userList[activeChatId] : [], activeChatId: activeChatId || null };
})(UserList);
