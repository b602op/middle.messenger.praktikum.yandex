import Handlebars from "handlebars";

import { Component } from "../../core";

type NavProps = any;

export class Nav extends Component {
    constructor({ id, className, children }: NavProps = {}) {
        super({ id, className, children }, Handlebars.compile(`<nav>{{{ children }}}</nav>`));
    }
}
