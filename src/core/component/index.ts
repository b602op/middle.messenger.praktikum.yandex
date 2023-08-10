import { compile } from "handlebars";
import { v4 as makeUUID } from "uuid";
import type { TemplateDelegate } from "handlebars";
import { ComponentEvent } from "./types";

import { EventBus } from "../eventbus";

export const identity = <T>(value: T): T => value;


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
    private readonly __id: string;
    private readonly __eventBus: EventBus;
    private readonly __templateDelegate: TemplateDelegate;
    private __template: HTMLTemplateElement;
    private __content: TComponentOrComponentArray | null | undefined;
    private __components: TComponentRecord;
    private __listeners: TEventListenerRecord;
    private __pseudoClasses: Record<string, boolean>;
    public readonly props: P;

    constructor(props?: P, templateDelegate?: TemplateDelegate) {
        this.__id = makeUUID();
        this.props = this._makePropsProxy(props ?? ({} as any));
        this.__templateDelegate = templateDelegate ?? compile("{{{ content }}}");
        this.__eventBus = new EventBus();
        this._registerEvents();
        this.__eventBus.emit(ComponentEvent.INIT);
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
        this.__eventBus.on(ComponentEvent.INIT, this._init.bind(this));
        this.__eventBus.on(ComponentEvent.RENDER, this._render.bind(this));
        this.__eventBus.on(ComponentEvent.CDM, this._componentDidMount.bind(this));
        this.__eventBus.on(ComponentEvent.CDU, this._componentDidUpdate.bind(this));
    }

    private _init(): void {
        this.__template = this._createDocumentElement("template") as HTMLTemplateElement;
        this.init();
        this.__eventBus.emit(ComponentEvent.RENDER);
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
        typeof component?.__listeners !== "undefined" && component._removeEventListeners(component.__listeners);
        typeof component?.__components !== "undefined" && Object.values(component.__components).forEach(
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
        typeof component?.__listeners !== "undefined" && component._addEventListeners(component.__listeners);
        typeof component?.__components !== "undefined" && Object.values(component.__components).forEach(
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
        typeof component?.__pseudoClasses !== "undefined" && component._applyPseudoClasses(component.__pseudoClasses);
        typeof component?.__components !== "undefined" && Object.values(component.__components).forEach(
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

        this.__content = this.render();

        const context = { ...cloneDeep(this.props), ...(this.__content ? { content: this.__content } : {}) };
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

        if (this.__templateDelegate) {
            this.__template.innerHTML = this.__templateDelegate(context);
        }

        const element = this.__template.content.firstElementChild;
        if (element) {
            if (!element.getAttribute("id")) {
                element.setAttribute("id", this.__id);
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
                                this.__template.content.firstElementChild?.addEventListener(key, listener);
                            }
                        )
                        : this.__template.content.firstElementChild?.addEventListener(key, val);
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
                        parent.appendChild(this.__template.content);
                    }
                } else {
                    elementOrElementArray.replaceWith(this.__template.content.firstElementChild);
                }
            }
        }

        this._setAttributes();

        this.__components = components;
        this.__listeners = allListeners;
        this.__pseudoClasses = pseudoClasses;

        this._removeAllEventListeners(this);
        this._applyAllPseudoClasses(this);
        this._addAllEventListeners(this);

        this.__eventBus.emit(ComponentEvent.CDM);
    }

    private _findElementInDOM(): any {
        return this.__content
            ? Array.isArray(this.__content)
                ? this.__content.map(component => component._findElementInDOM())
                : this.__content._findElementInDOM()
            : document.getElementById(this.__id);
    }

    private _applyPseudoClasses(pseudoClasses: Record<string, boolean>): void {
        const element = document.getElementById(this.__id) as HTMLInputElement;
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
        const element = component.__id && document.getElementById(component.__id);
        if (element) {
            component.__template.content.appendChild(element);
        }
        return component.__id ? `<div id="${component.__id}"></div>` : "";
    }

    private _replaceStub<T extends IComponentProps = IComponentProps>(component: Component<T>): void {
        if (component.__id) {
            this.__template.content.getElementById(component.__id)?.replaceWith(component.getContent());
        }
    }

    private _removeEventListeners(listeners: TEventListenerRecord): void {
        const element = document.getElementById(this.__id);
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
        const element = document.getElementById(this.__id);
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
        response && this.__eventBus.emit(ComponentEvent.RENDER);
    }

    protected componentDidUpdate(_: P, __: P): boolean {
        return true;
    }

    public setProps(nextProps: P): void {
        const oldProps = cloneDeep(this.props);
        nextProps && Object.assign(this.props, nextProps);
        const newProps = cloneDeep(this.props);
        this.__eventBus.emit(ComponentEvent.CDU, oldProps, newProps);
    }

    public getContent(): DocumentFragment {
        return this.__template.content;
    }

    private _setAttributes(): void {
        const element = this.__template.content.firstElementChild;
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

    public show(_: string): void {
        if (!this.element) {
            if (!this.content.firstElementChild) {
                this.__eventBus.emit(ComponentEvent.RENDER);
            }
            document.getElementById("root")?.replaceWith(this.content);
        }
    }

    public hide(_: string): void {
        document.body.innerHTML = `<div id="root"></div>`;
    }

    public get element(): HTMLElement | null {
        return document.getElementById(
            this.__content
                ? Array.isArray(this.__content)
                    ? this.__content[0].__id
                    : this.__content.__id
                : this.__id
        );
    }

    public get content(): DocumentFragment | HTMLElement {
        return this.__template.content;
    }

    public set content(element: DocumentFragment | HTMLElement) {
        this.__template.content.append(element);
    }
}

