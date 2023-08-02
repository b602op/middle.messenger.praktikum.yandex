import { type IUser } from "../../api/AuthAPI";
import { EventBus } from "../eventbus";
import { set } from "../utils";

enum LoadingTypes {
    chats = "chats"
}
export interface State {
    user?: IUser;
    activeChatId?: number;
    chats?: Array<{
        avatar: string | null;
        id: number;
        created_by: number;
        last_message: null | string;
        title: string;
        unread_count: number;
    }>;
    loading?: {
        [key in LoadingTypes]: boolean;
    };
    userList?: Record<number, Array<{
        avatar: string | null;
        display_name: string | null;
        first_name: string | null;
        id: number;
        role: string;
        second_name: string;
    }>>;
    userSearch?: any[];
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
