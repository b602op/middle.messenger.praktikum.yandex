import Handlebars from "handlebars";

import { Component } from "../core";
import { type IComponentProps } from "../core/component";

interface InputProps extends IComponentProps {
    onChange?: () => void;
    onFocus?: () => void;
    className?: string;
    value: string;
    name: string;
    placeholder?: string;
};

export class Input extends Component<InputProps> {
    constructor({ className, name, children, value, onChange, onFocus, placeholder }: InputProps) {
        super({ className, name, children, value, onChange, onFocus, placeholder }, Handlebars.compile(`<label class="{{{ className }}}">{{{ children }}}<input placeholder="{{{ placeholder }}}" name="{{{ name }}}" value="{{{ value }}}"></label>`));
    }
}
