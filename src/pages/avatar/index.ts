import { Button } from "../../components/buttons";
import { AvatarForm } from "../../components/forms";
import { Page } from "../../components/main/page";
import { Component } from "../../core";

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

        window.location.href = "/profile";
    }
}
