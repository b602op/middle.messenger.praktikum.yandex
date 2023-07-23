import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

export enum FormMethod {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE"
}

interface InfoProps extends IComponentProps {
    className?: string;
    method: FormMethod;
    action?: string;
    onSubmit?: EventListener;
}

export class Form extends Component<InfoProps> {
    constructor({ method, className, children, action }: InfoProps) {
        super({ method, className, children, action }, Handlebars.compile(`<form class="{{{ className }}}" method="{{{ method }}}" action="{{{ action }}}">{{{ children }}}</form>`));
    }
}
