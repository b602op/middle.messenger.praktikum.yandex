import { Info } from "../../components/blocks/Info";
import { Container } from "../../components/blocks/container";
import { Button } from "../../components/buttons";
import { AvatarIcon, UserList, ChatsList } from "../../components/main";
import { Chat } from "../../components/main/chat/Chat";
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
                        new Chat({
                            value: []
                        }),
                        new AvatarIcon({
                            children: "Иван Иванов Иванович"
                        })
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
