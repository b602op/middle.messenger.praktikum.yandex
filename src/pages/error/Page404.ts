import { Button } from "../../components/buttons";
import { Info } from "../../components/blocks/Info";
import { Component } from "../../core";
import { Page } from "../../components/main/page";
import Router from "../../core/Router";

export class Page404 extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    tag: "h1",
                    children: "404"
                }),
                new Button({
                    onclick: () => { Router.back(); },
                    children: "назад",
                    className: "back"
                })
            ]
        });
    }
}
