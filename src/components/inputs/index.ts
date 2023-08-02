import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../core/component";

interface InputProps extends IComponentProps {
    onChange?: () => void;
    onFocus?: () => void;
    className?: string;
    value: string;
    name: string;
    placeholder?: string;
    error?: string | null;
    type?: string;
};

export class Input extends Component<InputProps> {
    constructor({ error, className, name, children, value, onChange, onFocus, placeholder, type }: InputProps) {
        super({ error, className, name, children, value, onChange, onFocus, placeholder, type },
            Handlebars.compile(`<label class="{{{ className }}}">{{{ children }}}<input class="input-height {{#if error }}error{{/if}}" placeholder="{{{ placeholder }}}" name="{{{ name }}}" value="{{{ value }}}" type="{{{ type }}}"></label>{{#if error }}<span class="error">{{{error}}}</span>{{/if}}`));
    }
}
