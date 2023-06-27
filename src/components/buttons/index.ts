import Handlebars from "handlebars";

import { Component } from "../core";

interface ButtonProps {
    onclick?: () => void;
    className?: string;
    children: string;
};

export class Button extends Component {
    constructor({ className, children, onclick }: ButtonProps) {
        super({ className, children, onclick }, Handlebars.compile(`<button className={{{ className }}} onclick={{{ onclick }}}>{{{ children }}}</button>`));
    }
}
