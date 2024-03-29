import { Nav, NavLink } from "../../components/blocks";
import { Info } from "../../components/blocks/Info";
import { Page } from "../../components/main/page";
import { Component } from "../../core";
import { RouterPath } from "../../core/Router";

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
                        href: RouterPath.authorization,
                        children: "Авторизация"
                    }),
                    new NavLink({
                        href: RouterPath.registration,
                        children: "Регистрация"
                    }),
                    new NavLink({
                        href: RouterPath.chat,
                        children: "Страница чата"
                    }),
                    new NavLink({
                        href: RouterPath.profile,
                        children: "Профиль пользователя"
                    }),
                    new NavLink({
                        href: RouterPath.page404,
                        children: "Ошибка 404"
                    }),
                    new NavLink({
                        href: RouterPath.page500,
                        children: "Ошибка 500"
                    })
                ]
            })
        });
    }
}
