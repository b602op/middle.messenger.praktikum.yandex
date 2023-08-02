import { controller } from "../../../controllers";
import { Component } from "../../../core";
import { withStore } from "../../../core/Store/hook";
import { Container, ContainerRow } from "../../blocks/container";
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
                        onChange: this.handleChange.bind(this)
                    }),
                    new Button({
                        children: "+",
                        onclick: this.handleAdd.bind(this),
                        className: "button-min",
                        disable: !this.props.title
                    })
                ],
            className: "underline-container"
        });
    }

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({ title: target.value || "" });
    }

    protected handleAdd(): void {
        if (!this.props.title) return;

        controller.createChat(this.props.title);
    }
}

export default withStore((state: any) => {
    return { loading: state.loading.createChat };
})(NewChat);
