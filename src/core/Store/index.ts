import { type IUser } from "../../api/AuthAPI";
import { type Component } from "../component";
import { EventBus } from "../eventbus";
import { set } from "../utils";

export interface State {
    user?: IUser;
}

export enum StoreEvents {
    Updated = "updated"
}

export type TState = Record<string, any>;

enum StorageEvent {
    UpdateState = "update",
}

class Store extends EventBus {
    private readonly state: State = {};

    getState(): State {
        return this.state;
    }

    set(path: string, value: unknown): undefined {
        const currentState = this.getState();

        set(currentState, path, value);

        if (typeof this.listeners[StoreEvents.Updated] !== "undefined") {
            this.emit(StorageEvent.UpdateState, currentState);
        }
    }
}

const store = new Store();

export function withStore<T extends Record<string, any>>(mapStateToProps: (state: State) => any) {
    return (CurrentComponent: typeof Component<T>) => {
        return class extends CurrentComponent {
            constructor(props: T) {
                super({ ...props, ...mapStateToProps(store.getState()) });

                store.on(StorageEvent.UpdateState, () => {
                    const propsFromState = mapStateToProps(store.getState());
                    this.setProps(propsFromState);
                });
            }
        };
    };
}

export default store;
