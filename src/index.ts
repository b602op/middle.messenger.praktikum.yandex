import {
    RegistrationPage,
    NavigationPage,
    LoginPage,
    Page404,
    Page500,
    ProfilePage,
    ChatPage,
    PasswordPage,
    AvatarPage
} from "./pages";

export type TPage =
    | NavigationPage
    | LoginPage
    | RegistrationPage
    | Page404
    | Page500
    | ProfilePage
    | ChatPage
    | PasswordPage
    | AvatarPage;

type GetSlugTypes = (value: string) => string;

const getSlug: GetSlugTypes = (url: string) => {
    const newUrl = url.replace("/", "");

    if (url.match("/")) return getSlug(newUrl);

    return newUrl;
};

const getPage = (): TPage => {
    switch (getSlug(location.pathname)) {
        case "":
            return new NavigationPage({});
        case "login":
            return new LoginPage({});
        case "registration":
            return new RegistrationPage({});
        case "profile":
            return new ProfilePage({});
        case "chat":
            return new ChatPage({});
        case "404":
            return new Page404({});
        case "password":
            return new PasswordPage({});
        case "avatar":
            return new AvatarPage({});
        default:
            return new Page500({});
    }
};

document.getElementById("root")?.replaceWith(
    getPage().getContent()
);
