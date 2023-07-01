import { Component } from "../../core";

interface LinkProps {
    id?: string;
    className?: string;
    children: string;
    href: string;
};

export class Link extends Component<LinkProps> {
    constructor({
        id,
        className,
        children,
        href
    }: LinkProps) {
        super({ id, className, children, href }, Handlebars.compile(`<a id={{id}} href={{href}} {{ className }}>{{{ children }}}</a>`));
    }

    protected getAttributes(): Record<string, string> {
        return {
            href: this.props.href
        };
    }
}
