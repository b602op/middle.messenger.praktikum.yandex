import { type Component } from "../component";
import { redirectRote } from "./helper";

function isEqual(lhs: string, rhs: string): boolean {
    return lhs === rhs;
}

function render(query: string, block: Component): Element {
    const root = document.querySelector(query);

    if (root === null) {
        throw new Error(`root not found by selector "${query}"`);
    }

    root.innerHTML = "";

    root.append(block.getContent());

    return root;
}

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
    protected readonly _props: { rootQuery: string };
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
    private static __instance: Router;
    private readonly routes: Route[] = [];
    private currentRoute: Route | null = null;
    private readonly history = window.history;

    constructor(private readonly rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];

        Router.__instance = this;
    }

    public use(pathname: RouterPath, block: typeof Component): this {
        const route = new Route(pathname, block, this.rootQuery);

        this.routes.push(route);

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

        if (this.currentRoute && this.currentRoute !== route) {
            this.currentRoute.leave();
        }

        const currentRender = (redirectRote: Route): void => {
            this.currentRoute = redirectRote;
            redirectRote.render();
        };

        redirectRote({ routes: this.routes, path: pathname, render: currentRender });
    }

    public go(pathname: RouterPath): void {
        this.history.pushState({}, "", pathname);

        this._onRoute(pathname);
    }

    public back(): void {
        this.history.back();
    }

    public forward(): void {
        this.history.forward();
    }

    private getRoute(pathname: RouterPath): Route | undefined {
        return this.routes.find((Route) => Route.match(pathname));
    }
}

export default new Router("#root");
