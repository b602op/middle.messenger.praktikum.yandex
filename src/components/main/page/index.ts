import Handlebars from "handlebars";

import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface PageProps extends IComponentProps {
    id?: string;
    className?: string;
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
