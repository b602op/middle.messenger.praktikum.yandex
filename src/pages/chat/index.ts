import { Info } from "../../components/blocks/Info";
import { Container, ContainerColumn } from "../../components/blocks/container";
import { Button } from "../../components/buttons";
import { MessageForm } from "../../components/forms";
import { AvatarIcon, UserList, ChatsList } from "../../components/main";
import MessageList from "../../components/main/massage";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import Router from "../../core/Router";

export class ChatPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "страница чатов",
                    tag: "h1"
                }),

                new Container({
                    children: [
                        new ChatsList({}),
                        new UserList({}),
                        new ContainerColumn({
                            children: [
                                new MessageList({}),
                                new MessageForm({})
                            ],
                            className: "chat chat-items"
                        }),

                        new AvatarIcon({})
                    ],
                    className: "chat-content"
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

        Router.back();
    }
}
