import { controller } from "../../../controllers";
import { Component } from "../../../core";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { Info } from "../../blocks/Info";
import { ContainerColumn, ContainerRow } from "../../blocks/container";
import { ImageMin } from "../../blocks/image";
import { Button } from "../../buttons";
import { Input } from "../../inputs";

interface SearchUserProps {
    login?: string;
    loading?: string;
    activeChatId?: number;
    userSearch?: any[];
};

export class SearchUser extends Component<SearchUserProps> {
    constructor({ login, loading, activeChatId, userSearch }: SearchUserProps) {
        super({ login, loading, activeChatId, userSearch });
    }

    protected getSearchUser(): Component[] {
        const currentUsers = this.props.userSearch;

        if (!currentUsers) return [];
        if (!currentUsers.length) {
            return [
                new Info({
                    children: "ничего не найдено",
                    tag: "span"
                })
            ];
        };

        const callback = ({ login, id, avatar }: { avatar: string; login: string; id: string }): Component => {
            return new ContainerRow({
                children: [
                    new ImageMin({
                        value: avatar
                    }),
                    new Info({
                        tag: "span",
                        children: `${login} id: ${id}`
                    }),
                    new Button({
                        children: "+",
                        className: "button-min",
                        onclick: this.handleAdd.bind(this, id)
                    })
                ]
            });
        };

        const result = [
            new Button({
                children: "скрыть",
                onclick: this.removeSearchUserFromStore.bind(this)
            }),
            ...currentUsers.map(callback)
        ];

        return result;
    }

    protected render(): Component | Component[] {
        return new ContainerColumn({
            children: [
                this.props.activeChatId
                    ? new ContainerRow({
                        children: this.props.loading
                            ? null
                            : [
                                new Input({
                                    value: this.props.login ?? "",
                                    name: "title",
                                    placeholder: "поиск пользователя",
                                    className: "chat-input",
                                    onkeypress: this.handleChange.bind(this),
                                    onchange: this.handleChange.bind(this)
                                }),
                                new Button({
                                    children: "🔍",
                                    onclick: this.handleSearch.bind(this),
                                    className: "button-min"
                                })
                            ]
                    })
                    : new Info({
                        tag: "span",
                        children: "выберите чат"
                    }),
                ...this.getSearchUser()
            ]
        });
    }

    public login = this.props.login;

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.login = target.value;
    }

    protected handleSearch(): void {
        if (!this.login) return;

        controller.searchUser(this.login);

        this.setProps({ ...this.props, login: this.login });
    }

    protected handleAdd(id: number): void {
        const currentActiveChatId = this.props.activeChatId;

        if (currentActiveChatId) {
            controller.addUserInChat({ users: [id], chatId: currentActiveChatId },
                { good: () => { controller.getChatUser(currentActiveChatId, true); } }
            );
        }
    }

    protected removeSearchUserFromStore(): void {
        store.set("userSearch", null);
    }
}

export default withStore(state => {
    const { activeChatId, userSearch, userList } = state;

    let currentUserSearch = [];

    if (!userSearch) {
        return { activeChatId, userSearch };
    }

    if (userList && activeChatId && userList[activeChatId]) {
        const arr = userList[activeChatId].map(({ id: id2 }) => id2);

        currentUserSearch = userSearch.filter(({ id: id1 }) => !arr.includes(id1));
    }

    return { activeChatId, userSearch: currentUserSearch };
})(SearchUser);
