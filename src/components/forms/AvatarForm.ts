import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";

interface ValueType { avatar: string | null };
export interface AvatarFormProps extends IComponentProps {
    value: ValueType;
}

export class AvatarForm extends Component<AvatarFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "ссылка на аватарку",
                    value: this.props.value.avatar ?? "",
                    name: "avatar",
                    onChange: this.handleChange.bind(this),
                    placeholder: "url"
                }),
                new Button({
                    children: "отправить",
                    onclick: this.handleFormSubmit.bind(this)
                })
            ]
        });
    }

    protected handleChange(event: InputEvent): void {
        const target = event.target as HTMLInputElement;

        this.setProps({
            value: { avatar: target.value }
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        console.log(this.props.value, " - Avatar Data");
    }
}
