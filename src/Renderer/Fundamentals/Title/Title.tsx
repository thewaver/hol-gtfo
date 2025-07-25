import { ParentProps } from "solid-js";

import { TitleProps } from "./Title.types";

import "./Title.css";

export const Title = (props: ParentProps<TitleProps>) => {
    return <div class="title">{props.children}</div>;
};
