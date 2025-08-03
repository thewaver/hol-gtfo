import { Accessor } from "solid-js";

export type GridProps = {
    center?: Accessor<boolean>;
    templateColumns: Accessor<string>;
};
