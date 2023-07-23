import Handlebars from "handlebars";
import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface ButtonProps extends IComponentProps {
    onclick?: () => void;
    className?: string;
};

export class Button extends Component<ButtonProps> {
    constructor({ className, children, onclick }: ButtonProps) {
        super({ className, children, onclick }, Handlebars.compile(`<button class="{{{ className }}}">{{{ children }}}</button>`));
    }
}
