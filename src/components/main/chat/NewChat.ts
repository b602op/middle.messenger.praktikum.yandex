import { controller } from "../../../controllers";
import { Component } from "../../../core";
import store from "../../../core/Store";
import { withStore } from "../../../core/Store/hook";
import { ContainerRow } from "../../blocks/container";
import { Button } from "../../buttons";
import { Input } from "../../inputs";

interface NewChatProps {
    title?: string;
    loading?: boolean;
};

export class NewChat extends Component<NewChatProps> {
    constructor({ title, loading }: NewChatProps) {
        super({ title, loading });
    }

    protected render(): Component | Component[] {
        return new ContainerRow({
            children: this.props.loading
                ? null
                : [
                    new Input({
                        value: this.props.title ?? "",
                        name: "title",
                        placeholder: "имя для нового чата",
                        className: "chat-input",
                        onkeypress: this.handleChange.bind(this),
                        onchange: this.handleChange.bind(this)
                    }),
                    new Button({
                        children: "+",
                        onclick: this.handleAdd.bind(this),
                        className: "button-min"
                    })
                ],
            className: "underline-container"
        });
    }

    protected title = this.props.title;

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.title = target.value;
    }

    protected handleAdd(): void {
        if (!this.title) return;

        controller.createChat(this.title, {
            good: () => {
                store.set("loading.createChats", false);
            }
        });
    }
}

export default withStore((state: any) => {
    return { loading: state.loading.createChat };
})(NewChat);
