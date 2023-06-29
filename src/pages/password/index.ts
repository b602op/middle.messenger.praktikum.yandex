import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { PasswordForm } from "../../components/forms/PasswordForm";

export class PasswordPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "изменение пароля",
                    tag: "h1"
                }),
                new PasswordForm({ value: { newPassword: null, password: null } }),
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
}