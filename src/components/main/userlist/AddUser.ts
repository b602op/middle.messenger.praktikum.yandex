import { controller } from "../../../controllers";
import { Component } from "../../../core";
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
    userSearch: any[];
};

export class SearchUser extends Component<SearchUserProps> {
    constructor({ login, loading, activeChatId, userSearch }: SearchUserProps) {
        super({ login, loading, activeChatId, userSearch });
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
                                    onChange: this.handleChange.bind(this)
                                }),
                                new Button({
                                    children: "🔍",
                                    onclick: this.handleSearch.bind(this),
                                    className: "button-min",
                                    disable: !this.props.login
                                })
                            ]
                    })
                    : new Info({
                        tag: "span",
                        children: "выберите чат"
                    }),
                ...this.props.userSearch.map(({ login, id, avatar }: { avatar: string; login: string; id: string }) => {
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
                }),
                this.props.userSearch.length === 0
                    ? null
                    : new Button({
                        children: "скрыть"
                    })
            ]
        });
    }

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({ ...this.props, login: target.value || "" });
    }

    protected handleSearch(): void {
        if (!this.props.login) return;

        controller.searchUser(this.props.login);
    }

    protected handleAdd(id: number): void {
        const currentActiveChatId = this.props.activeChatId;

        if (currentActiveChatId) {
            controller.addUserInChat({ users: [id], chatId: currentActiveChatId },
                () => { controller.getChatUser(currentActiveChatId, true); });
        }
    }
}

export default withStore(state => {
    const { activeChatId, userSearch = [], userList } = state;

    let currentUserSearch = [];

    if (userList && activeChatId && userList[activeChatId]) {
        const arr = userList[activeChatId].map(({ id: id2 }) => id2);

        currentUserSearch = userSearch.filter(({ id: id1 }) => !arr.includes(id1));
    }

    return { activeChatId, userSearch: currentUserSearch };
})(SearchUser);
