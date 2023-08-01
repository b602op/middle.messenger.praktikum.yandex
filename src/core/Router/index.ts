import store from "../Store";
import { type Component } from "../component";

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

class Route {
    private block: Component | null = null;

    constructor(
        private readonly pathname: string,
        private readonly BlockClass: typeof Component,
        private readonly query: string) {
    }

    leave(): undefined {
        this.block = null;
    }

    match(pathname: string): boolean {
        return isEqual(pathname, this.pathname);
    }

    render(): undefined {
        if (!this.block) {
            this.block = new this.BlockClass({});

            render(this.query, this.block);
        }
    }
}

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

        if (!route) {
            const route3 = this.getRoute(RouterPath.page404);
            if (route3) {
                this.currentRoute = route3;
                route3.render();
            }

            return;
        }

        if (this.currentRoute && this.currentRoute !== route) {
            this.currentRoute.leave();
        }

        const currentUser = store.getState().user;

        if (!currentUser) {
            const route2 = this.getRoute(RouterPath.authorization);
            if (route2) {
                this.currentRoute = route2;
                route2.render();
            }
        } else {
            if (pathname === RouterPath.authorization) {
                const route4 = this.getRoute(RouterPath.chat);
                if (route4) {
                    this.currentRoute = route4;

                    route4.render();
                }
                ;
            } else {
                this.currentRoute = route;
                route.render();
            }
        }
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
