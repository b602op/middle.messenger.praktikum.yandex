import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { AvatarForm } from "../../components/forms";

export class AvatarPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new AvatarForm({
                    avatar: null
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
}
