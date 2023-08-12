import { Router, RouterPath } from "./core/Router";

import {
    RegistrationPage,
    LoginPage,
    Page404,
    Page500,
    ProfilePage,
    ChatPage,
    PasswordPage,
    AvatarPage
} from "./pages";
import "./styles.pcss";

export type TPage =
    | LoginPage
    | RegistrationPage
    | Page404
    | Page500
    | ProfilePage
    | ChatPage
    | PasswordPage
    | AvatarPage;

const router = new Router("#root");

router
    .use(RouterPath.authorization, LoginPage)
    .use(RouterPath.registration, RegistrationPage)
    .use(RouterPath.profile, ProfilePage)
    .use(RouterPath.chat, ChatPage)
    .use(RouterPath.page404, Page404)
    .use(RouterPath.page500, Page500)
    .use(RouterPath.password, PasswordPage)
    .use(RouterPath.avatar, AvatarPage)
    .start();
