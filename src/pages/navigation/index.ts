// import { BoxAlignItems, BoxJustifyContent } from "../../components/box/types";

import { Nav, NavLink } from "../../components/blocks";
import { Component, Page } from "../../components/core";

// import type { TComponentOrComponentArray } from "../../core/component/types";

export class NavigationPage extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: new Nav({
                children: [
                    new NavLink({
                        href: "/login/",
                        children: "Авторизация"
                    }),
                    new NavLink({
                        href: "/registration/",
                        children: "Регистрация"
                    }),
                    new NavLink({
                        href: "/chats/",
                        children: "Страница чатов"
                    }),
                    new NavLink({
                        href: "/profile/",
                        children: "Профиль пользователя"
                    }),
                    new NavLink({
                        href: "/not-found/",
                        children: "Ошибка 404"
                    }),
                    new NavLink({
                        href: "/server-error/",
                        children: "Ошибка 500"
                    })
                ]
            })
        });
    }
}
