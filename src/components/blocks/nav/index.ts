import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

interface NavProps extends IComponentProps {
    id?: string;
    className?: string;
    href?: string;
};

export class Nav extends Component<NavProps> {
    constructor({ id, className, children }: NavProps) {
        super({ id, className, children }, Handlebars.compile(`<nav><ul>{{{ children }}}</ul></nav>`));
    }
}
