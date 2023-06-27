import { NavigationPage, LoginPage } from "./pages";

export type TPage = any;

const getPage = (): TPage => {
    switch (location.pathname) {
        case "/":
            return new NavigationPage();
        case "/login/":
            return new LoginPage();
        // case "/registration/":
        //     return new RegistrationPage();
        // case "/chats/":
        //     return new ChatsPage();
        // case "/profile/":
        //     return new ProfilePage();
        // case "/not-found/":
        //     return new NotFoundPage();
        // case "/server-error/":
        //     return new ServerErrorPage();
        // default:
        //     return new NotFoundPage();
    }
};

// document.body.prepend(new Header().getContent());
// document.body.appendChild(new Footer().getContent());

document.getElementById("root")?.replaceWith(
    getPage().getContent()
);
