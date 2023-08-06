import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

interface InfoProps extends IComponentProps {
    tag: "h1" | "h2" | "span";
    className?: string;
    title?: string;
}

export class Info extends Component<InfoProps> {
    constructor({ tag, className, children, title }: InfoProps) {
        super({ tag, className, children, title }, Handlebars.compile(`<{{{ tag }}} title="{{{title}}}" class="{{{ className }}}">{{{ children }}}</{{{ tag }}}>`));
    }
}
