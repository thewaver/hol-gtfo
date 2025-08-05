import { ParentProps } from "solid-js";

import { GridRowProps } from "./GridRow.types";

import "./GridRow.css";

export const GridRow = (props: ParentProps<GridRowProps>) => {
    return <div class={`gridRow ${props.index() % 2 === 0 ? "even" : "odd"}`}>{props.children}</div>;
};
