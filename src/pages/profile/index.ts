import { Info } from "../../components/blocks/Info";
import { Container } from "../../components/blocks/container";
import { Button } from "../../components/buttons";
import UserForm from "../../components/forms/UserForm";
import { Page } from "../../components/main/page";
import { controller } from "../../controllers";
import { Component } from "../../core";
import Router, { RouterPath } from "../../core/Router";
import store from "../../core/Store";

export class ProfilePage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "изменение данных",
                    tag: "h1"
                }),
                new Container({
                    children: [
                        new UserForm({}),
                        new Container({
                            children: [
                                new Button({
                                    onclick: this.handleToChangePassword.bind(this),
                                    children: "изменить пароль"
                                }),
                                new Button({
                                    onclick: this.handleToChangeAvatar.bind(this),
                                    children: "изменить аватар"
                                }),
                                new Button({
                                    onclick: this.handleChat.bind(this),
                                    children: "перейти в чат",
                                    className: "back"
                                })
                            ]
                        })
                    ],
                    className: "profile-container"
                }),
                new Button({
                    onclick: this.handleCancel.bind(this),
                    children: "выйти"
                })
            ]
        });
    }

    private handleCancel(event: SubmitEvent): void {
        event.preventDefault();

        store.clearStore();

        controller.logout();

        // Router.go(RouterPath.default);
    }

    private handleToChangePassword(event: SubmitEvent): void {
        event.preventDefault();

        Router.go(RouterPath.password);
    }

    private handleToChangeAvatar(event: SubmitEvent): void {
        event.preventDefault();

        Router.go(RouterPath.avatar);
    }

    private handleChat(event: SubmitEvent): void {
        event.preventDefault();

        controller.getChats();

        Router.go(RouterPath.chat);
    }
}
