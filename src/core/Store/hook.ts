import store, { StorageEvent, type State } from ".";
import { type Component } from "../component";

export function withStore<T extends Record<string, any>>(mapStateToProps: (state: State) => any) {
    return (CurrentComponent: typeof Component<T>) => {
        return class extends CurrentComponent {
            constructor(props: T) {
                const newProps = { ...props, ...mapStateToProps(store.getState()) };
                console.log(newProps, "newProps");
                super(newProps);

                store.on(StorageEvent.UpdateState, () => {
                    const propsFromState = mapStateToProps(store.getState());
                    this.setProps(propsFromState);
                });
            }
        };
    };
}
