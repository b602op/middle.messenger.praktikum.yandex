import Handlebars from "handlebars";

import { Component } from "../../core";

interface NavLinkProps {
    id?: string;
    className?: string;
    children: any;
    href?: string;
};

export class NavLink extends Component {
    constructor({ id, className, children, href }: NavLinkProps) {
        super({ id, className, children, href }, Handlebars.compile(`<li><a href={{{ href }}}>{{{ children }}}</a></li>`));
    }
}
