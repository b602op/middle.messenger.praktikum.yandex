import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { AuthorizationForm } from "../../components/forms/AuthorizationForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";

export class LoginPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "авторизация",
                    tag: "h1"
                }),
                new AuthorizationForm({ value: { login: null, password: null } }),
                new Button({
                    onclick: this.handleToRegistration.bind(this),
                    children: "регистрация"
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

    private handleToRegistration(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = "/registration";
    }
}
