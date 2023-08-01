import { withStore } from "../../../core/Store/hook";
import { Component, type IComponentProps } from "../../../core/component";
import { Button } from "../../buttons";

interface ChatProps extends IComponentProps {
    href?: string;
};

class AvatarIcon extends Component<ChatProps> {
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

export default withStore((state: any) => {
    return { children: state.user.first_name };
})(AvatarIcon);
