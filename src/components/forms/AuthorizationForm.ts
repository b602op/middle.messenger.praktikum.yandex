import { Component, Page } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";

export class AuthorizationForm extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Input({
                    onChange: () => { console.log("логин"); },
                    children: "логин",
                    value: "login",
                    name: "login"
                }),
                new Input({
                    onChange: () => { console.log("пароль"); },
                    children: "пароль",
                    value: "password",
                    name: "password"
                }),
                new Button({
                    onclick: () => { console.log("войти"); },
                    children: "войти"
                }),
                new Button({
                    onclick: () => { console.log("регистрация"); },
                    children: "регистрация"
                }),
                new Button({
                    onclick: () => { console.log("назад"); },
                    children: "назад"
                })
            ]
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        formData.forEach(
            (value, key) => {
                console.log(key, value);
            }
        );
    }
}
