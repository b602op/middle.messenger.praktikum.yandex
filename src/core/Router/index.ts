import { type Component } from "../component";
import { redirectRote } from "./helper";

interface IRouteProps {
    rootQuery: string;
}

function isEqual(lhs: string, rhs: string): boolean {
    return lhs === rhs;
}

export const render = (query: string, block: Component): Element | null => {
    const root = document.querySelector(query);
    root?.replaceWith(block.getContent());
    return root;
};

export enum RouterPath {
    authorization = "/",
    default = "/",
    chat = "/messenger",
    registration = "/sign-up",
    avatar = "/avatar",
    profile = "/settings",
    page404 = "/404",
    page500 = "/500",
    password = "/password",
}

export class Route<P extends Record<string, any> = any> {
    protected readonly _ComponentClass: typeof Component<P>;
    protected readonly _props: IRouteProps;
    protected _component: Component<P> | null;
    protected _pathname: string;

    constructor(pathname: string, ComponentClass: typeof Component<P>, props: IRouteProps) {
        this._pathname = pathname;
        this._ComponentClass = ComponentClass;
        this._component = null;
        this._props = props;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this.render();
        }
    }

    leave(): void {
        this._component?.hide(this._props.rootQuery);
    }

    match(pathname: string): boolean {
        return isEqual(pathname, this._pathname);
    }

    render(): void {
        if (!this._component) {
            this._component = new this._ComponentClass();
            render(this._props.rootQuery, this._component);
            return;
        }
        this._component.show(this._props.rootQuery);
    }
}

export type TypeRoute = Route;

export class Router {
    protected static _instance: Router | null;
    protected _rootQuery: string;
    protected _currentRoute: Route | null;
    protected _routes: Route[];
    protected _history: History;

    constructor(rootQuery: string) {
        if (Router._instance) {
            return Router._instance;
        }

        this._rootQuery = rootQuery;
        this._currentRoute = null;
        this._routes = [];
        this._history = window.history;

        Router._instance = this;
    }

    public use(pathname: RouterPath, block: typeof Component): this {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery });
        this._routes.push(route);
        return this;
    }

    public start(): void {
        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window;

            this._onRoute(target.location.pathname as any);
        };

        this._onRoute(window.location.pathname as any);
    }

    private _onRoute(pathname: RouterPath): void {
        const route = this.getRoute(pathname);

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        const currentRender = (redirectRote: Route): void => {
            this._currentRoute = redirectRote;
            redirectRote.render();
        };

        redirectRote({ routes: this._routes, path: pathname, render: currentRender });
    }

    public go(pathname: RouterPath): void {
        this._history.pushState({}, "", pathname);

        this._onRoute(pathname);
    }

    public back(): void {
        this._history.back();
    }

    public forward(): void {
        this._history.forward();
    }

    private getRoute(pathname: RouterPath): Route | undefined {
        return this._routes.find((Route) => Route.match(pathname));
    }
}

export default new Router("#root");
