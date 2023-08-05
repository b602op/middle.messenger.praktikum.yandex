import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { AuthorizationForm } from "../../components/forms/AuthorizationForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import Router, { RouterPath } from "../../core/Router";

export class LoginPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "авторизация",
                    tag: "h1"
                }),
                new Info({
                    children: "для тестирования",
                    tag: "span"
                }),
                new Info({
                    children: "Login: edik159",
                    tag: "span"
                }),
                new Info({
                    children: "pass: PORNOv11",
                    tag: "span"
                }),
                new AuthorizationForm({}),
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

        Router.back();
    }

    private handleToRegistration(event: SubmitEvent): void {
        event.preventDefault();

        Router.go(RouterPath.registration);
    }
}
