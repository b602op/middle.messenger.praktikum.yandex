import { Component, type IComponentProps } from "../../../core/component";
import { Button } from "../../buttons";

interface ChatProps extends IComponentProps {
    href?: string;
};

export class AvatarIcon extends Component<ChatProps> {
    constructor({ href, children }: ChatProps) {
        super({ href, children });
    }

    protected render(): Component | Component[] {
        return new Button({
            className: "avatar",
            onclick: this.handleToProfile.bind(this),
            children: this.props.children
        });
    }

    private handleToProfile(event: SubmitEvent): void {
        event.preventDefault();

        window.location.href = this.props.href ?? "/";
    }
}
