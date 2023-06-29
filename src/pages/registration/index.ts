import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { RegistrationForm } from "../../components/forms/RegistrationForm";

export class RegistrationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "форма регистрации",
                    tag: "h1"
                }),
                new RegistrationForm({
                    value: {
                        email: null,
                        login: null,
                        name: null,
                        second_name: null,
                        phone: null,
                        password: null
                    }
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
}
