import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import Router, { RouterPath } from "../../core/Router";

export class RegistrationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "форма регистрации",
                    tag: "h1"
                }),
                new RegistrationForm({}),
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

        Router.go(RouterPath.authorization);
    }
}
