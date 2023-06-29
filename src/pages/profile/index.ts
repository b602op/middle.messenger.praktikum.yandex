import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { UserForm } from "../../components/forms/UserForm";

export class ProfilePage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "изменение данных",
                    tag: "h1"
                }),
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
                new Button({
                    onclick: this.handleToChangePassword.bind(this),
                    children: "изменить пароль"
                }),
                new Button({
                    onclick: this.handleCancel.bind(this),
                    children: "назад",
                    className: "back"
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

        window.location.href = "/";
    }

    private handleToChangePassword(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/password";
    }
}
