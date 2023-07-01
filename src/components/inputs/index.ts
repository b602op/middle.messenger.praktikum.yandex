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
    error?: string | null;
};

export class Input extends Component<InputProps> {
    constructor({ error, className, name, children, value, onChange, onFocus, placeholder }: InputProps) {
        super({ error, className, name, children, value, onChange, onFocus, placeholder }, Handlebars.compile(`<label class="{{{ className }}}">{{{ children }}}<input {{#if error }}class="error"{{/if}} mozactionhint="" placeholder="{{{ placeholder }}}" name="{{{ name }}}" value="{{{ value }}}"></label>{{#if error }}<span class="error">{{{error}}}</span>{{/if}}`));
    }
}
