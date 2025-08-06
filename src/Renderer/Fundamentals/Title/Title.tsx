import { ParentProps } from "solid-js";

import { TitleProps } from "./Title.types";

import "./Title.css";

export const Title = (props: ParentProps<TitleProps>) => {
    return <span class="title">{props.children}</span>;
};

export const SubTitle = (props: ParentProps<TitleProps>) => {
    return <span class="sub title">{props.children}</span>;
};
