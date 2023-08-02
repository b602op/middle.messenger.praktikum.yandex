import { type IRemoveUsersFromChatData } from "../../../api/AuthAPI";
import { Component } from "../../../core";
import { Info } from "../../blocks/Info";
import { ContainerRow } from "../../blocks/container";
import { ImageMin } from "../../blocks/image";
import { Button } from "../../buttons";

interface UserBlockProps {
    avatar: string;
    login: string;
    role: string;
    id: number;
    removeUser: (value: Omit<IRemoveUsersFromChatData, "chatId">) => void;
    // display_name: string;
    // first_name: string;
    // id: number;
    // second_name: string;
};

export class UserBlock extends Component<UserBlockProps> {
    constructor({ avatar, login, role, removeUser, id }: UserBlockProps) {
        super({ avatar, login, role, removeUser, id });
    }

    protected render(): Component | Component[] {
        return new ContainerRow({
            children: [
                new ImageMin({
                    value: this.props?.avatar || ""
                }),
                new Info({
                    tag: "span",
                    children: this.props?.login || "",
                    className: "user-block-login",
                    title: this.props?.role === "admin" ? "администатор чата" : "участник чата"
                }),
                new Button({
                    children: "🗑",
                    onclick: this.handleDeleteUser.bind(this),
                    className: "delete-button"
                })

            ],
            className: `user-block-container${this.props?.role === "admin" ? " user-block-admin" : ""}`
        });
    }

    protected handleDeleteUser(): void {
        this.props.removeUser({ users: [this.props.id] });
    }
}

export default UserBlock;
