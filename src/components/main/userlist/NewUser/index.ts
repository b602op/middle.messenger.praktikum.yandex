import { controller } from "../../../../controllers";
import { Component } from "../../../../core";
import { withStore } from "../../../../core/Store/hook";
import { Container } from "../../../blocks/container";
import { Button } from "../../../buttons";
import { Input } from "../../../inputs";

interface NewUserProps {
    value: {
        title: string;
        loading?: boolean;
    };
};

export class NewUser extends Component<NewUserProps> {
    constructor({ value }: NewUserProps) {
        super({ value });
    }

    protected render(): Component | Component[] {
        return new Container({
            children: this.props.value.loading
                ? null
                : [
                    new Input({
                        value: this.props.value.title ?? "",
                        name: "title",
                        placeholder: "имя для нового чата",
                        className: "chat-input",
                        onChange: this.handleChange.bind(this)
                    }),
                    this.props.value.title
                        ? new Button({
                            children: "добавить",
                            onclick: this.handleAdd.bind(this)
                        })
                        : null
                ]
        });
    }

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        console.log(target, " target");

        this.setProps({ value: { title: target.value || "" } });
    }

    protected handleAdd(): void {
        console.log(this.props.value.title, " this.props.value.title");

        if (!this.props.value.title) return;

        controller.createChat(this.props.value.title);
    }
}

export default withStore((state: any) => {
    return { loading: state.loading.createChat };
})(NewUser);
