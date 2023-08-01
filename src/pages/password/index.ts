import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { PasswordForm } from "../../components/forms/PasswordForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import Router from "../../core/Router";

export class PasswordPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "изменение пароля",
                    tag: "h1"
                }),
                new PasswordForm({ value: { newPassword: null, password: null }, errors: { newPassword: null, password: null }, newPassword2: null }),
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

        Router.back();
    }
}
