import Handlebars from "handlebars";

import { Component } from "../core";

interface InputProps {
    onChange?: () => void;
    className?: string;
    children: string;
    value: string;
    name: string;
};

export class Input extends Component {
    constructor({ className, name, children, value, onChange }: InputProps) {
        super({ className, name, children, value, onChange }, Handlebars.compile(`<lable className={{{ className }}}>{{{ children }}}<input onChange={{{ onChange }}} name="login" value="login"></lable>`));
    }
}
