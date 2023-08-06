import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

interface ContainerProps extends IComponentProps {
    className?: string;
}

export class Container extends Component<ContainerProps> {
    constructor({ className, children }: ContainerProps) {
        super({ className, children }, Handlebars.compile(`<div class="{{{ className }}}">{{{ children }}}</div>`));
    }
}

export class ContainerColumn extends Component<ContainerProps> {
    constructor({ className, children }: ContainerProps) {
        super({ className, children }, Handlebars.compile(`<div class="container-column {{{ className }}}">{{{ children }}}</div>`));
    }
}

export class ContainerRow extends Component<ContainerProps> {
    constructor({ className, children }: ContainerProps) {
        super({ className, children }, Handlebars.compile(`<div class="container-row {{{ className }}}">{{{ children }}}</div>`));
    }
}
