import { Component, Page } from "../../components/core";
import { AuthorizationForm } from "../../components/forms/AuthorizationForm";

export class LoginPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new AuthorizationForm()
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
