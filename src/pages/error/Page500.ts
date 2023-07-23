import { Button } from "../../components/buttons";
import { Info } from "../../components/blocks/Info";
import { Component } from "../../core";
import { Page } from "../../components/main/page";

export class Page500 extends Component {
    protected render(): Component | Component[] {
        return new Page({
            children: [
                new Info({
                    tag: "h1",
                    children: "500"
                }),
                new Button({
                    onclick: () => { window.location.href = "/"; },
                    children: "назад",
                    className: "back"
                })
            ]
        });
    }
}
