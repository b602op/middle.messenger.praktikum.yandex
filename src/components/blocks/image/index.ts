import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

interface ImageProps extends IComponentProps {
    value: string | null;
    className?: string;
    title?: string;
}

export class Image extends Component<ImageProps> {
    constructor({ value, className, title }: ImageProps) {
        super({ value, className, title }, Handlebars.compile(`<image width="100" height="100" src="{{{value}}}" title="{{{ title }}}" class="{{{ className }}}" />`));
    }
}

export class ImageMin extends Component<ImageProps> {
    constructor({ value, className, title }: ImageProps) {
        super({ value, className, title }, Handlebars.compile(`<image width="20" height="20" src="{{#if value }}https://ya-praktikum.tech/api/v2/resources/{{{value}}}{{/if}}" title="{{{ title }}}" class="{{{ className }}}" />`));
    }
}
