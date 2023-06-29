import { Component } from "../core";
import { Button } from "../buttons";
import { Input } from "../inputs";
import { Form, FormMethod } from "./Form";
import { type IComponentProps } from "../core/component";
import { validationValue } from "./helpers";
export interface AvatarFormProps extends IComponentProps {
    avatar: string | null;
}

export class AvatarForm extends Component<AvatarFormProps> {
    protected render(): Component | Component[] {
        return new Form({
            method: FormMethod.post,
            children: [
                new Input({
                    children: "ссылка на аватарку",
                    value: this.props.avatar ?? "",
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
            avatar: target.value
        });
    }

    private handleFormSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const currentValue = validationValue(this.props.avatar ?? "", "avatar");

        if (currentValue) console.log(currentValue, " - Avatar Data");
    }
}
