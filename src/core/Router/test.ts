import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { assert } from "chai";
import { Component } from "../component";
import { Route } from '.'

describe("Route class tests", () => {
    it("should set pathname when initialized", () => {
        const MockedRoute = class extends Route {
            get pathname(): string {
                return this.pathname;
            }
        };
        const pathname = "/some/path/";
        const ComponentClass = Component;
        const props = { rootQuery: "#root" };
        const instance = new MockedRoute(pathname, ComponentClass, props);

        const expected = pathname;
        const actual = instance.pathname;

        assert.equal(actual, expected);
    });

    it("should set ComponentClass when initialized", () => {
        const MockedRoute = class extends Route {
            get ComponentClass(): typeof Component {
                return this._ComponentClass;
            }
        };
        const pathname = "/some/path/";
        const ComponentClass = Component;
        const props = { rootQuery: "#root" };
        const instance = new MockedRoute(pathname, ComponentClass, props);

        const expected = ComponentClass;
        const actual = instance.ComponentClass;

        assert.equal(actual, expected);
    });

    it("should component is equal null when initialized", () => {
        const MockedRoute = class extends Route {
            get component(): Component | null {
                return this._component;
            }
        };
        const pathname = "/some/path/";
        const ComponentClass = Component;
        const props = { rootQuery: "#root" };
        const instance = new MockedRoute(pathname, ComponentClass, props);

        assert.isNull(instance.component);
    });

    it("should set props when initialized", () => {
        const MockedRoute = class extends Route {
            get props(): any {
                return this._props;
            }
        };
        const pathname = "/some/path/";
        const ComponentClass = Component;
        const props = { rootQuery: "#root" };
        const instance = new MockedRoute(pathname, ComponentClass, props);

        const expected = `{"rootQuery":"#root"}`;
        const actual = JSON.stringify(instance.props);

        assert.equal(actual, expected);
    });

    describe("match method tests", () => {
        class MockedRoute extends Route {
            get pathname(): string {
                return this._pathname;
            }
        };
        const pathname: string = "/some/path/";
        let instance: MockedRoute;

        beforeEach(() => {
            const ComponentClass = Component;
            const props = { rootQuery: "#root" };
            instance = new MockedRoute(pathname, ComponentClass, props);
        });

        it("should return true if passed pathname equal route pathname", () => {
            const res = instance.match(pathname);
            assert.isTrue(res);
        });

        it("should return false if passed pathname not equal route pathname", () => {
            const pathname = "/some/other/pathname/";
            const res = instance.match(pathname);
            assert.isFalse(res);
        });
    });

    describe("render method tests", () => {
        const mockedRenderMethod = sinon.fake();
        const { Route } = proxyquire(".", {
            "./helpers": {
                render: mockedRenderMethod
            }
        });

        it("should call render function when component is null", () => {
            class MockedComponent {
                render(): void {}
            };
            const MockedRoute = class extends Route {
                constructor() {
                    super();
                    this._props = { rootQuery: "#root" };
                    this._ComponentClass = MockedComponent;
                    this._component = null;
                }
            };
            const instance = new MockedRoute();
            instance.render();
            assert.isTrue(mockedRenderMethod.calledOnce);
        });

        it("should call component show method when component is not null", () => {
            const mockedShowMethod = sinon.fake();
            class MockedComponent {
                show = mockedShowMethod;
            };
            const MockedRoute = class extends Route {
                constructor() {
                    super();
                    this._props = { rootQuery: "#root" };
                    this._component = new MockedComponent();
                }
            };
            const instance = new MockedRoute();
            instance.render();
            assert.isTrue(mockedShowMethod.calledOnce);
        });
    });

    describe("leave method tests", () => {
        it("should call component hide method when component is not null", () => {
            const mockedHideMethod = sinon.fake();
            class MockedComponent {
                hide = mockedHideMethod;
            };
            const MockedRoute = class extends Route {
                constructor(pathname: string, ComponentClass: typeof Component, props: any) {
                    super(pathname, ComponentClass, props);
                    this._component = new ComponentClass();
                }
            };
            const pathname = "/some/path/";
            const ComponentClass = MockedComponent as any;
            const props = { rootQuery: "#root" };
            const instance = new MockedRoute(pathname, ComponentClass, props);
            instance.leave();
            assert.isTrue(mockedHideMethod.calledOnce);
        });
    });

    describe("navigate method tests", () => {
        it("should call route render method when pathname is match", () => {
            const mockedRenderMethod = sinon.fake();
            const MockedRoute = class extends Route {
                render = mockedRenderMethod;

                match(_: string): boolean {
                    return true;
                }
            };
            const pathname = "/some/path/";
            const ComponentClass = Component;
            const props = { rootQuery: "#root" };
            const instance = new MockedRoute(pathname, ComponentClass, props);
            instance.navigate(pathname);
            assert.isTrue(mockedRenderMethod.calledOnce);
        });

        it("should not call route render method when pathname is not match", () => {
            const mockedRenderMethod = sinon.fake();
            const MockedRoute = class extends Route {
                render = mockedRenderMethod;

                match(_: string): boolean {
                    return false;
                }
            };
            const pathname = "/some/path/";
            const ComponentClass = Component;
            const props = { rootQuery: "#root" };
            const instance = new MockedRoute(pathname, ComponentClass, props);
            instance.navigate(pathname);
            assert.isFalse(mockedRenderMethod.calledOnce);
        });
    });
});
