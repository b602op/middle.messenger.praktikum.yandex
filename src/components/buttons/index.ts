import Handlebars from "handlebars";
import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface ButtonProps extends IComponentProps {
    onclick?: () => void;
    className?: string;
    disable?: boolean;
};

export class Button extends Component<ButtonProps> {
    constructor({ className, children, onclick, disable }: ButtonProps) {
        super({ className, children, onclick, disable }, Handlebars.compile(`<button class="{{{ className }}}{{#if disable }} button-disabled{{/if}}">{{{ children }}}</button>`));
    }
}
