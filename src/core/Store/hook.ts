import store, { StorageEvent, type State } from ".";
import { type Component } from "../component";

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
