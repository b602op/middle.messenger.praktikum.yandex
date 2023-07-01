import { Nav, NavLink } from "../../components/blocks";
import { Info } from "../../components/blocks/Info";
import { Component, Page } from "../../components/core";

export class NavigationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: new Nav({
                children: [
                    new Info({
                        children: "навигация",
                        tag: "h1"
                    }),
                    new NavLink({
                        href: "/login",
                        children: "Авторизация"
                    }),
                    new NavLink({
                        href: "/registration",
                        children: "Регистрация"
                    }),
                    new NavLink({
                        href: "/chat",
                        children: "Страница чата"
                    }),
                    new NavLink({
                        href: "/profile",
                        children: "Профиль пользователя"
                    }),
                    new NavLink({
                        href: "/404",
                        children: "Ошибка 404"
                    }),
                    new NavLink({
                        href: "/500",
                        children: "Ошибка 500"
                    })
                ]
            })
        });
    }
}
