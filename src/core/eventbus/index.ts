export type TEventListener<T = unknown> = (...args: T[]) => void;

export class EventBus {
    protected _listeners: Record<string, TEventListener[]>;

    constructor() {
        this._listeners = {};
    }

    _eventExistCheck(event: string): void {
        if (typeof this._listeners[event] === "undefined") {
            throw new Error(`Event "${event}" does not exist.`);
        }
    }

    on(event: string, callback: TEventListener): void {
        if (typeof this._listeners[event] === "undefined") {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    off(event: string, callback: TEventListener): void {
        this._eventExistCheck(event);
        this._listeners[event] = this._listeners[event].filter(
            listener => listener !== callback
        );
        if (!this._listeners[event].length) {
            this._listeners = Object.fromEntries(
                Object.entries(this._listeners).filter(
                    ([key, _]) => key !== event
                )
            );
        }
    }

    emit<T = unknown>(event: string, ...args: T[]): void {
        this._eventExistCheck(event);
        this._listeners[event].forEach(
            listener => {
                listener(...args);
            }
        );
    }

    stringify(): string {
        const strListeners = Object.entries(this._listeners).map(
            ([event, listeners]) => {
                const strListeners: string = listeners.map(
                    listener => `[Function: ${listener.name}]`
                ).join(", ");
                return `${event}: [ ${strListeners} ]`;
            }
        ).join(", ");
        return `{ ${strListeners} }`;
    }
}
