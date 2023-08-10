import { type IUser } from "../../api/AuthAPI";
import { cloneDeep } from "../component";
import { EventBus } from "../eventbus";
import { set } from "../utils";

enum LoadingTypes {
    chats = "chats"
}

export interface IMessage {
    id: number;
    user_id: number;
    chat_id: number;
    type: string;
    time: string;
    content: string;
    is_read: boolean;
    file: string | null;
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
    chatsToken?: {
        data?: {
            token: string;
        };
    };
    messages?: IMessage[];
}

export type TState = Record<string, any>;

export enum StorageEvent {
    UpdateState = "update",
}

export class Store extends EventBus {
    protected readonly _state: TState = {};

    public getState(): TState {
        return cloneDeep(this._state);
    }

    public set(path: string, value: unknown): void {
        set(this._state, path, value);
        if (typeof this._listeners[StorageEvent.UpdateState] !== "undefined") {
            this.emit(StorageEvent.UpdateState);
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
