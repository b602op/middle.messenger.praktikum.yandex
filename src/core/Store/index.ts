import { type IUser } from "../../api/AuthAPI";
import { type Component } from "../component";
import { EventBus } from "../eventbus";
import { set } from "../utils";

export interface State {
    user?: IUser;
}

export type TState = Record<string, any>;

export enum StorageEvent {
    UpdateState = "update",
}

class Store extends EventBus {
    private readonly state: State = {};

    getState(): State {
        return this.state;
    }

    set(path: string, value: unknown): void {
        const currentState = this.getState();

        set(currentState, path, value);

        if (typeof this.listeners[StorageEvent.UpdateState] !== "undefined") {
            this.emit(StorageEvent.UpdateState, currentState);
        }
    }

    clearStore(): void {
        const currentState = this.getState();

        Object.keys(currentState).forEach(path => {
            this.set(path, null);
        });
    }
}

const store = new Store();

export default store;
