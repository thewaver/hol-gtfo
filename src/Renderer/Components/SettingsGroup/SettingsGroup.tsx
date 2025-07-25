import { ParentProps } from "solid-js";

import { SettingsGroupProps } from "./SettingsGroup.types";

import "./SettingsGroup.css";

export const SettingsGroup = (props: ParentProps<SettingsGroupProps>) => {
    return <div class="settingsGroup">{props.children}</div>;
};
