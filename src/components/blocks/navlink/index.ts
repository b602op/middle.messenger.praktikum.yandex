import Handlebars from "handlebars";

import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface NavLinkProps extends IComponentProps {
    id?: string;
    className?: string;
    href?: string;
};

export class NavLink extends Component<NavLinkProps> {
    constructor({ id, className, children, href }: NavLinkProps) {
        super({ id, className, children, href }, Handlebars.compile(`<li><a href="{{{ href }}}">{{{ children }}}</a></li>`));
    }
}
