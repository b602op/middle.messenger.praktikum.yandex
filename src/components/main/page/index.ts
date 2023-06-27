import Handlebars from "handlebars";

import { Component } from "../../core";

interface PageProps {
    id?: string;
    className?: string;
    children: any;
};

export class Page extends Component<PageProps> {
    constructor({
        id,
        className,
        children
    }: PageProps) {
        super({ id, className, children }, Handlebars.compile(`<main>{{{ children }}}</main>`));
    }
}
