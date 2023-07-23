export type TEventListener<T = unknown> = (...args: T[]) => void;

export class EventBus {
    listeners: Record<string, TEventListener[]>;

    constructor() {
        this.listeners = {};
    }

    _eventExistCheck(event: string): void {
        if (typeof this.listeners[event] === "undefined") {
            throw new Error(`Event "${event}" does not exist.`);
        }
    }

    on(event: string, callback: TEventListener): void {
        if (typeof this.listeners[event] === "undefined") {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: TEventListener): void {
        this._eventExistCheck(event);
        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }

    emit<T = unknown>(event: string, ...args: T[]): void {
        this._eventExistCheck(event);
        this.listeners[event].forEach(
            listener => {
                listener(...args);
            }
        );
    }
}
