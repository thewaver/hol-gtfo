import { ParentProps } from "solid-js";

import { SurfaceProps } from "./Surface.types";

import "./Surface.css";

export const Surface = (props: ParentProps<SurfaceProps>) => {
    return <div class={`surface ${props.unpadded?.() ? "unpadded" : "padded"}`}>{props.children}</div>;
};
