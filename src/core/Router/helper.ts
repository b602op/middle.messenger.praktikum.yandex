import { RouterPath, type TypeRoute } from ".";
import { controller } from "../../controllers";
import store from "../Store";

interface PropsType {
    routes: TypeRoute[];
    path: RouterPath;
    render: (value: TypeRoute) => void;
};

export const redirectRote = ({ routes, path, render }: PropsType): void => {
    const router404 = routes.find((Route) => Route.match(RouterPath.page404)) as TypeRoute;

    const handleRoute = (value?: TypeRoute): void => { render(value ?? router404); };

    const callback = (): void => {
        const isUser = store.getState().user;

        if (isUser) {
            switch (path) {
                case RouterPath.registration:
                case RouterPath.authorization: {
                    const value = routes.find((Route) => Route.match(RouterPath.profile));
                    handleRoute(value);
                    break;
                }
                default: {
                    const value = routes.find((Route) => Route.match(path));
                    handleRoute(value);
                    break;
                }
            }
        } else {
            switch (path) {
                case RouterPath.registration:
                case RouterPath.authorization: {
                    const value = routes.find((Route) => Route.match(path));
                    handleRoute(value);
                    break;
                }
                default: {
                    const value = routes.find((Route) => Route.match(RouterPath.authorization));
                    handleRoute(value);
                    break;
                }
            }
        }
    };

    controller.getUser({ good: callback });
};
