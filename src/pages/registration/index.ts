import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { Page } from "../../components/main/page";
import { Component } from "../../core";

const defaultData = {
    value: {
        email: null,
        login: null,
        name: null,
        firstName: null,
        displayName: null,
        secondName: null,
        phone: null,
        password: null
    },
    errors: {
        email: null,
        login: null,
        name: null,
        firstName: null,
        displayName: null,
        secondName: null,
        phone: null,
        password: null
    },
    password2: null
};
export class RegistrationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "форма регистрации",
                    tag: "h1"
                }),
                new RegistrationForm(defaultData),
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
