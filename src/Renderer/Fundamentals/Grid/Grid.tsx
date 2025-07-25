import { ParentProps } from "solid-js";

import { GridProps } from "./Grid.types";

import "./Grid.css";

export const Grid = (props: ParentProps<GridProps>) => {
    return (
        <div class="grid" style={{ "grid-template-columns": props.templateColumns() }}>
            {props.children}
        </div>
    );
};
