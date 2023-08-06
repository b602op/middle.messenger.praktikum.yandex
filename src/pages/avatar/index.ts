import { Button } from "../../components/buttons";
import { AvatarForm } from "../../components/forms";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import Router from "../../core/Router";

export class AvatarPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new AvatarForm({
                    value: {
                        avatar: null
                    }
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

        Router.back();
    }
}
