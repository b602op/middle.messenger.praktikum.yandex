import Handlebars from "handlebars";

import { Component } from "../../core";
import { type IComponentProps } from "../../core/component";

interface ContainerProps extends IComponentProps {
    className?: string;
}

export class Container extends Component<ContainerProps> {
    constructor({ className, children }: ContainerProps) {
        super({ className, children }, Handlebars.compile(`<div class="{{{ className }}}">{{{ children }}}</div>`));
    }
}
