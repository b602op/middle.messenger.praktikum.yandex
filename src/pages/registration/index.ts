import { Info } from "../../components/blocks/Info";
import { Button } from "../../components/buttons";
import { RegistrationForm } from "../../components/forms/RegistrationForm";
import { type RegistrationFormFields } from "../../components/forms/types";
import { Page } from "../../components/main/page";
import { Component } from "../../core";

const defaultData: RegistrationFormFields = {
    first_name: "Edik456",
    second_name: "Edik456",
    login: "Edik456",
    email: "Edik456@mail.ru",
    password: "Edik456Edik456",
    password2: "Edik456Edik456",
    phone: "+7456456456"
};

// first_name: newValue.name ?? "",
//             second_name: newValue.secondName ?? "",
//             login: newValue.login ?? "",
//             email: newValue.email ?? "",
//             password: newValue.password ?? "",
//             phone: newValue.phone ?? ""

export class RegistrationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "форма регистрации",
                    tag: "h1"
                }),
                new RegistrationForm({ value: defaultData }),
                new Button({
                    onclick: this.handleCancel.bind(this),
                    children: "назад",
                    className: "back"
                })
            ]
        });
    }

    private handleCancel(event: SubmitEvent): void {
        // event.preventDefault();

        // window.location.href = "/";
    }
}
