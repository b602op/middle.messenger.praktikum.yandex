import Handlebars from "handlebars";
import { Component, type IComponentProps } from "../../../core/component";

interface ImageProps extends IComponentProps {
    value?: string | null;
    className?: string;
    title?: string;
    defaultValue?: string;
}
const url = "https://ya-praktikum.tech/api/v2/resources";

const defaultAvatar = "/5e76f2c9-92df-4d2a-872d-19853badec50/4c7ad326-ec68-4f9f-8e25-a7c1159e7674_images.jpg";

const getAvatar = (value?: string | null, defaultValue?: string): string => {
    const isSameAvatar = !!value;

    const defaultImg = defaultValue ?? defaultAvatar;

    return `${url}${isSameAvatar ? value : defaultImg}`;
};

export class Image extends Component<ImageProps> {
    constructor({ value, className, title, defaultValue }: ImageProps) {
        const avatar = getAvatar(value, defaultValue);

        super({ value: avatar, className, title }, Handlebars.compile(`<image width="100" height="100" src="{{{value}}}" title="{{{ title }}}" class="{{{ className }}}" />`));
    }
}

export class ImageMin extends Component<ImageProps> {
    constructor({ value, className, title, defaultValue }: ImageProps) {
        const avatar = getAvatar(value, defaultValue);

        super({ value: avatar, className, title }, Handlebars.compile(`<image width="20" height="20" src="{{#if value }}{{{value}}}{{/if}}" title="{{{ title }}}" class="{{{ className }}}" />`));
    }
}
