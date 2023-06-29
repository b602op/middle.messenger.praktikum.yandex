import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { AuthorizationForm } from "../../components/forms/AuthorizationForm";

export class Avatar extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "смена аватара",
                    tag: "h1"
                }),
                new AuthorizationForm({ value: { login: null, password: null } }),
                new Button({
                    onclick: this.handleToRegistration.bind(this),
                    children: "регистрация"
                }),
                new Button({
                    onclick: this.handleCancel.bind(this),
                    children: "назад"
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
