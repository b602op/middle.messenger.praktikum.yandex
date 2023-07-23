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

class Router {
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

    public use(pathname: string, block: typeof Component): this {
        const route = new Route(pathname, block, this.rootQuery);
        this.routes.push(route);

        return this;
    }

    public start(): undefined {
        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window;

            this._onRoute(target.location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): undefined {
        const route = this.getRoute(pathname);

        if (!route) {
            return;
        }

        if (this.currentRoute && this.currentRoute !== route) {
            this.currentRoute.leave();
        }

        this.currentRoute = route;

        route.render();
    }

    public go(pathname: string): undefined {
        this.history.pushState({}, "", pathname);

        this._onRoute(pathname);
    }

    public back(): undefined {
        this.history.back();
    }

    public forward(): undefined {
        this.history.forward();
    }

    private getRoute(pathname: string): Route | undefined {
        return this.routes.find(route => route.match(pathname));
    }
}

export default new Router("#app");
