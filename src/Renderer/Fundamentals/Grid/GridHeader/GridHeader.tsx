import { ParentProps } from "solid-js";

import { GridHeaderProps } from "./GridHeader.types";

import "./GridHeader.css";

export const GridHeader = (props: ParentProps<GridHeaderProps>) => {
    return <div class="gridHeader">{props.children}</div>;
};
