import { type IRemoveUsersFromChatData } from "../../../api/AuthAPI";
import { Component } from "../../../core";
import { Info } from "../../blocks/Info";
import { ContainerRow } from "../../blocks/container";
import { ImageMin } from "../../blocks/image";
import { Button } from "../../buttons";

export interface UserInformation {
    avatar?: string | null;
    display_name?: string | null;
    first_name?: string | null;
    id?: number | null;
    login?: string | null;
    role?: string | null;
    second_name?: string | null;
};
interface UserBlockProps {
    value?: UserInformation;
    removeUser: (value: Omit<IRemoveUsersFromChatData, "chatId">) => void;
    // display_name: string;
    // first_name: string;
    // id: number;
    // second_name: string;
};

export class UserBlock extends Component<UserBlockProps> {
    constructor({ value, removeUser }: UserBlockProps) {
        super({ value, removeUser });
    }

    protected defaultUser: UserInformation = this.props.value ?? {};

    protected render(): Component | Component[] {
        return new ContainerRow({
            children: [
                new ImageMin({
                    value: this.props.value?.avatar
                }),
                new Info({
                    tag: "span",
                    children: this.props.value?.display_name ?? this.props.value?.login,
                    className: "user-block-login",
                    title: this.props.value?.role === "admin" ? "администатор чата" : "участник чата"
                }),
                new Button({
                    children: "🗑",
                    onclick: this.handleDeleteUser.bind(this),
                    className: "delete-button"
                })

            ],
            className: `user-block-container${this.props.value?.role === "admin" ? " user-block-admin" : ""}`
        });
    }

    protected handleDeleteUser(): void {
        if (!this.defaultUser.id) return;

        this.props.removeUser({ users: [this.defaultUser.id] });
    }
}

export default UserBlock;
