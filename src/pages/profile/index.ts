import { Info } from "../../components/blocks/Info";
import { Container } from "../../components/blocks/container";
import { Button } from "../../components/buttons";
import { UserForm } from "../../components/forms/UserForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";

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
                        new UserForm({
                            value: {
                                email: null,
                                login: null,
                                name: null,
                                displayName: null,
                                secondName: null,
                                phone: null,
                                password: null
                            }
                        }),
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
                                    onclick: this.handleCancel.bind(this),
                                    children: "выйти"
                                })
                            ]
                        })
                    ],
                    className: "profile-container"
                }),
                new Button({
                    onclick: this.handleCancel.bind(this),
                    children: "назад",
                    className: "back"
                })

            ]
        });
    }

    private handleCancel(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/";
    }

    private handleToChangePassword(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/password";
    }

    private handleToChangeAvatar(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/avatar";
    }
}
