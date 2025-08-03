import { ParentProps } from "solid-js";

import { GridProps } from "./Grid.types";

import "./Grid.css";

export const Grid = (props: ParentProps<GridProps>) => {
    return (
        <div
            class="grid"
            style={{
                "align-items": props.center?.() ? "center" : undefined,
                "grid-template-columns": props.templateColumns(),
            }}
        >
            {props.children}
        </div>
    );
};
