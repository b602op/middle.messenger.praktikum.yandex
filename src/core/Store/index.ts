import { type IUser } from "../../api/AuthAPI";
import { type Component as Component2 } from "../component";
import { EventBus } from "../eventbus";
import { set } from "../utils";

export interface State {
    user?: IUser;
}

enum StorageEvent {
    UpdateState = "update",
}

class Store extends EventBus {
    private readonly state: State = {};

    getState(): State {
        return this.state;
    }

    set(path: string, value: unknown): undefined {
        set(this.state, path, value);

        console.log(this.state);

        this.emit(StorageEvent.UpdateState, this.state);
    }
}

const store = new Store();

export function withStore(mapStateToProps: (state: State) => any) {
    return (Component: typeof Component2) => {
        return class extends Component {
            constructor(props: any) {
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
