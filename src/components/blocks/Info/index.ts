import Handlebars from "handlebars";

import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface InfoProps extends IComponentProps {
    tag: "h1" | "h2" | "span";
    className?: string;
}

export class Info extends Component<InfoProps> {
    constructor({ tag, className, children }: InfoProps) {
        super({ tag, className, children }, Handlebars.compile(`<{{{ tag }}} class="{{{ className }}}">{{{ children }}}</{{{ tag }}}>`));
    }
}
