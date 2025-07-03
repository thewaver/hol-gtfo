/* @refresh reload */
import { render } from "solid-js/web";

import { App } from "./Renderer/App";

const root = document.getElementById("root");

render(() => <App />, root!);
