import { compile } from "handlebars";
import { v4 as makeUUID } from "uuid";
import type { TemplateDelegate } from "handlebars";

import { EventBus } from "../eventbus";

export const identity = <T>(value: T): T => value;

enum ComponentEvent {
    INIT = "init",
    CDM = "component-did-mount",
    CDU = "component-did-update",
    RENDER = "render"
}

export const cloneDeep = <T>(value: T): T | T[] | Record<string | number | symbol, T> => {
    if (value && typeof value === "object" && !(value instanceof Component)) {
        if (Array.isArray(value)) {
            return value.map(
                el => cloneDeep(el)
            );
        } else {
            return Object.fromEntries(
                Object.entries(value).map(
                    ([key, val]) => [key, cloneDeep(val)]
                )
            );
        }
    }
    return value;
};

export const isComponentOrComponentArray = (arg: unknown): arg is Component | Component[] => {
    return arg instanceof Component || (Array.isArray(arg) && arg.filter(identity).every(el => el instanceof Component));
};

export const isEventListenerOrEventListenerArray = (key: string, arg: unknown): arg is EventListener | EventListener[] => {
    return key.startsWith("on") && (typeof arg === "function" || (Array.isArray(arg) && arg.every(el => typeof el === "function")));
};

const pseudoClasses = ["focus"];

export const isPseudoClass = (key: string, arg: unknown): arg is boolean => {
    return pseudoClasses.includes(key) && typeof arg === "boolean";
};

type TComponentChild = Component | string | number | boolean | undefined | null;

export interface IComponentProps {
    id?: string;
    children?: TComponentChild | TComponentChild[];
    className?: string;
}

export type TComponentOrComponentArray = Component | Component[];

export type TComponentRecord = Record<string, TComponentOrComponentArray>;

export type TEventListenerOrEventListenerArray = EventListener | EventListener[];

export type TEventListenerRecord = Record<string, TEventListenerOrEventListenerArray>;

export class Component<P extends Record<string, any> = any> {
    protected _template: HTMLTemplateElement;
    protected eventBus: EventBus;
    private _components: TComponentRecord;
    private _listeners: TEventListenerRecord;
    private _pseudoClasses: Record<string, boolean>;
    private _content: TComponentOrComponentArray | null | undefined;
    protected _id: string;

    constructor(protected props: P = {} as any, protected templateDelegate?: TemplateDelegate) {
        this._id = makeUUID();
        this.props = this._makePropsProxy(props);
        this.templateDelegate = templateDelegate ?? compile("{{{ content }}}");
        this.eventBus = new EventBus();
        this._registerEvents();
        this.eventBus.emit(ComponentEvent.INIT);
    }

    private _makePropsProxy(props: P): P {
        return new Proxy(props, {
            get: (target: P, prop: string) => {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set: (target: P, prop: string, value) => {
                (target as Record<string, any>)[prop] = value;
                return true;
            },
            deleteProperty: () => {
                throw new Error("Not allowed");
            }
        });
    }

    private _registerEvents(): void {
        this.eventBus.on(ComponentEvent.INIT, this._init.bind(this));
        this.eventBus.on(ComponentEvent.RENDER, this._render.bind(this));
        this.eventBus.on(ComponentEvent.CDM, this._componentDidMount.bind(this));
        this.eventBus.on(ComponentEvent.CDU, this._componentDidUpdate.bind(this));
    }

    private _init(): void {
        this._template = this._createDocumentElement("template") as HTMLTemplateElement;
        this.init();
        this.eventBus.emit(ComponentEvent.RENDER);
    }

    protected init(): void {}

    private _createDocumentElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    protected getComponentsAndListeners<T extends Record<string, any> = IComponentProps>(context: T): {
        components: TComponentRecord;
        listeners: TEventListenerRecord;
        pseudoClasses: Record<string, boolean>;
    } {
        const components: TComponentRecord = {};
        const listeners: TEventListenerRecord = {};
        const pseudoClasses: Record<string, boolean> = {};
        Object.keys(context).forEach((key) => {
            if (isComponentOrComponentArray(context[key])) {
                components[key] = context[key] as TComponentOrComponentArray;
            } else if (isEventListenerOrEventListenerArray(key, context[key])) {
                listeners[key.substring(2).toLocaleLowerCase()] = context[key] as TEventListenerOrEventListenerArray;
            } else if (isPseudoClass(key, context[key])) {
                pseudoClasses[key] = context[key];
            }
        });
        return { components, listeners, pseudoClasses };
    }

    private _removeAllEventListeners(component: Component): void {
        typeof component?._listeners !== "undefined" && component._removeEventListeners(component._listeners);
        typeof component?._components !== "undefined" && Object.values(component._components).forEach(
            (componentOrComponentArray) => {
                Array.isArray(componentOrComponentArray)
                    ? componentOrComponentArray.forEach(
                        component => {
                            this._removeAllEventListeners(component);
                        }
                    )
                    : this._removeAllEventListeners(componentOrComponentArray);
            }
        );
    }

    private _addAllEventListeners(component: Component): void {
        typeof component?._listeners !== "undefined" && component._addEventListeners(component._listeners);
        typeof component?._components !== "undefined" && Object.values(component._components).forEach(
            (componentOrComponentArray) => {
                Array.isArray(componentOrComponentArray)
                    ? componentOrComponentArray.forEach(
                        component => {
                            this._addAllEventListeners(component);
                        }
                    )
                    : this._addAllEventListeners(componentOrComponentArray);
            }
        );
    }

    private _applyAllPseudoClasses(component: Component): void {
        typeof component?._pseudoClasses !== "undefined" && component._applyPseudoClasses(component._pseudoClasses);
        typeof component?._components !== "undefined" && Object.values(component._components).forEach(
            (componentOrComponentArray) => {
                Array.isArray(componentOrComponentArray)
                    ? componentOrComponentArray.forEach(
                        component => {
                            this._applyAllPseudoClasses(component);
                        }
                    )
                    : this._applyAllPseudoClasses(componentOrComponentArray);
            }
        );
    }

    private _render(): void {
        this._removeAllEventListeners(this);

        const elementOrElementArray = this._findElementInDOM();

        this._content = this.render();

        const context = { ...cloneDeep(this.props), ...(this._content ? { content: this._content } : {}) };
        const { components, listeners, pseudoClasses } = this.getComponentsAndListeners(context);
        const internalListeners = this._getInternalListeners();
        const allListeners = Object.fromEntries(
            Object.entries(listeners).map(
                ([key, val]) => typeof internalListeners[key] !== "undefined"
                    ? (
                        [key, Array.isArray(val)
                            ? [...val, internalListeners[key]]
                            : [val, internalListeners[key]]]
                    )
                    : [key, val]
            ).concat(
                Object.entries(internalListeners).filter(
                    ([key, _]) => typeof internalListeners[key] === "undefined"
                )
            )
        );

        Object.entries(components).forEach(([key, val]) => {
            (context as Record<string, any>)[key] = Array.isArray(val)
                ? val.filter(identity).map(
                    component => this._renderStub(component)
                ).join("")
                : this._renderStub(val);
        });

        if (this.templateDelegate) {
            this._template.innerHTML = this.templateDelegate(context);
        }

        const element = this._template.content.firstElementChild;
        if (element) {
            if (!element.getAttribute("id")) {
                element.setAttribute("id", this._id);
            }

            Object.values(components).forEach(val => {
                Array.isArray(val)
                    ? val.filter(identity).forEach(
                        component => {
                            this._replaceStub(component);
                        }
                    )
                    : this._replaceStub(val);
            });

            Object.entries(listeners).forEach(
                ([key, val]) => {
                    Array.isArray(val)
                        ? val.forEach(
                            listener => {
                                this._template.content.firstElementChild?.addEventListener(key, listener);
                            }
                        )
                        : this._template.content.firstElementChild?.addEventListener(key, val);
                }
            );

            if (elementOrElementArray) {
                if (Array.isArray(elementOrElementArray)) {
                    const [element] = elementOrElementArray;
                    const parent = element?.parentNode;
                    if (parent) {
                        if (parent.tagName === "BODY") {
                            parent.querySelector("header").remove();
                            parent.querySelector("main").remove();
                            parent.querySelector("footer").remove();
                        } else {
                            parent.innerHTML = "";
                        }
                        parent.appendChild(this._template.content);
                    }
                } else {
                    elementOrElementArray.replaceWith(this._template.content.firstElementChild);
                }
            }
        }

        this._setAttributes();

        this._components = components;
        this._listeners = allListeners;
        this._pseudoClasses = pseudoClasses;

        this._removeAllEventListeners(this);
        this._applyAllPseudoClasses(this);
        this._addAllEventListeners(this);

        this._componentDidMount();
    }

    private _findElementInDOM(): any {
        return this._content
            ? Array.isArray(this._content)
                ? this._content.map(component => component._findElementInDOM())
                : this._content._findElementInDOM()
            : document.getElementById(this._id);
    }

    private _applyPseudoClasses(pseudoClasses: Record<string, boolean>): void {
        const element = document.getElementById(this._id) as HTMLInputElement;
        element && Object.entries(pseudoClasses).forEach(
            ([key, val]) => {
                val && this._applyPseudoClass(key, element);
            }
        );
    }

    private _applyPseudoClass(pseudoClass: string, element: HTMLInputElement): void {
        switch (pseudoClass) {
            case "focus":
                element.focus();
                element.type = "text";
                element.setSelectionRange(element.value.length, element.value.length);
                element.type = this.props.type;
        }
    }

    protected render(): TComponentOrComponentArray | null | undefined {
        return null;
    }

    private _renderStub<T extends IComponentProps = IComponentProps>(component: Component<T>): string {
        const element = component._id && document.getElementById(component._id);
        if (element) {
            component._template.content.appendChild(element);
        }
        return component._id ? `<div id="${component._id}"></div>` : "";
    }

    private _replaceStub<T extends IComponentProps = IComponentProps>(component: Component<T>): void {
        if (component._id) {
            this._template.content.getElementById(component._id)?.replaceWith(component.getContent());
        }
    }

    private _removeEventListeners(listeners: TEventListenerRecord): void {
        const element = document.getElementById(this._id);
        Object.entries(listeners).forEach(
            ([key, val]) => {
                Array.isArray(val)
                    ? val.forEach(
                        listener => element?.removeEventListener(key, listener)
                    )
                    : element?.removeEventListener(key, val);
            }
        );
    }

    private _addEventListeners(listeners: TEventListenerRecord): void {
        const element = document.getElementById(this._id);
        Object.entries(listeners).forEach(
            ([key, val]) => {
                Array.isArray(val)
                    ? val.forEach(
                        listener => element?.addEventListener(key, listener)
                    )
                    : element?.addEventListener(key, val);
            }
        );
    }

    private _componentDidMount(): void {
        this.componentDidMount();
    }

    protected componentDidMount(): void { }

    private _componentDidUpdate(oldProps: P, newProps: P): void {
        const response = this.componentDidUpdate(oldProps, newProps);
        this.eventBus.emit(ComponentEvent.RENDER);
        response && this.eventBus.emit(ComponentEvent.RENDER);
    }

    protected componentDidUpdate(oldProps: P, newProps: P): boolean {
        return true;
    }

    public setProps(nextProps: P): void {
        const oldProps = cloneDeep(this.props);
        nextProps && Object.assign(this.props, nextProps);
        const newProps = cloneDeep(this.props);
        this.eventBus.emit(ComponentEvent.CDU, oldProps, newProps);
    }

    public getContent(): DocumentFragment {
        return this._template.content;
    }

    private _setAttributes(): void {
        const element = this._template.content.firstElementChild;
        if (element) {
            const attrs = this.getAttributes();
            Object.entries(attrs).forEach(
                ([key, val]) => {
                    element.setAttribute(key, val);
                }
            );
        }
    }

    protected getAttributes(): Record<string, string> {
        return {};
    }

    private _getInternalListeners(): Record<string, EventListener> {
        const prototype = Object.getPrototypeOf(this);
        const propertyNames = Object.getOwnPropertyNames(prototype).filter(
            name => isEventListenerOrEventListenerArray(name, prototype[name])
        );
        return Object.fromEntries(
            propertyNames.map(
                name => [name.substring(2).toLocaleLowerCase(), prototype[name].bind(this)]
            )
        );
    }

    public show(querySelector: string): void {
        if (!this.element) {
            if (!this.content.firstElementChild) {
                this.eventBus.emit(ComponentEvent.RENDER);
            }
            document.getElementById("root")?.replaceWith(this.content);
        }
    }

    public hide(querySelector: string): void {
        document.body.innerHTML = `<div id="root"></div>`;
    }

    public get element(): HTMLElement | null {
        return document.getElementById(
            this._content
                ? Array.isArray(this._content)
                    ? this._content[0]._id
                    : this._content._id
                : this._id
        );
    }

    public get content(): DocumentFragment | HTMLElement {
        return this._template.content;
    }

    public set content(element: DocumentFragment | HTMLElement) {
        this._template.content.append(element);
    }
}
