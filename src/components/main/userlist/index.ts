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

    protected getUsers(): null | Component {
        if (!this.props.value?.length || !this.props.activeChatId) {
            return null;
        }

        const users = this.props.value.map((value: UserInformation) => (
            new UserBlock({ value, removeUser: this.handleRemoveUser.bind(this) })
        ));

        return new ContainerColumn({
            children: [
                new Info({
                    tag: "span",
                    children: `пользователи ЧАТА - id:${this.props.activeChatId}`
                }),
                ...users
            ]
        });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: [
                new ContainerColumn({
                    children: new SearchUser({}),
                    className: "underline-container"
                }),
                this.getUsers()
            ],
            className: "chat"
        });
    }

    protected handleUpdateUserList(): void {
        store.set("chats", null);

        controller.getChats();
    }

    protected handleRemoveUser(newData: Omit<IRemoveUsersFromChatData, "chatId">): void {
        if (this.props.activeChatId) {
            const data: IRemoveUsersFromChatData = { ...newData, chatId: this.props.activeChatId };

            controller.removeUserFromChat(data, {
                good: () => {
                    const { value } = this.props;

                    const id = newData.users[0];

                    this.setProps({ ...this.props, value: value.filter(({ id: currentId }) => currentId !== id) });
                }
            });
        }
    }
}

export default withStore((state: any) => {
    const { activeChatId, userList } = state;

    return { value: userList ? userList[activeChatId] : [], activeChatId: activeChatId || null };
})(UserList);
