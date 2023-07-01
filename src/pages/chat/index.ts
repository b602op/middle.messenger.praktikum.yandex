import { Info } from "../../components/blocks/Info";
import { Container } from "../../components/blocks/container";
import { Button } from "../../components/buttons";
import { Component, Page } from "../../components/core";
import { AvatarIcon, UserList } from "../../components/main";
import { Chat } from "../../components/main/chat/Chat";

export class ChatPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    children: "страница чата",
                    tag: "h1"
                }),

                new Container({
                    children: [
                        new UserList({
                            value: [{ name: "Петя Петров Петрович", imageUrl: "", active: true }, { name: "Саша Сашов Сашович", imageUrl: "", active: false }, { name: "Вася Васов Весович", imageUrl: "", active: false }]
                        }),
                        new Chat({
                            value: [{
                                massage: "привет, Иван",
                                self: false
                            }, {
                                massage: "привет, Петя",
                                self: true
                            }, {
                                massage: "пока, Иван",
                                self: false
                            }, {
                                massage: "давай пока, Петя",
                                self: true
                            }]
                        }),
                        new AvatarIcon({
                            href: "/profile/",
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

        window.location.href = "/";
    }
}
