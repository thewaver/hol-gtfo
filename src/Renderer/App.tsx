import { ParentProps } from "solid-js";

import { A, Navigate, Route, Router } from "@solidjs/router";

import { CombosPage } from "./Pages/Combos/CombosPage";
import { ScoresPage } from "./Pages/Scores/ScoresPage";

import "./App.css";

const Layout = (props: ParentProps<{}>) => {
    return (
        <>
            <div class="navWrapper">
                <div>{"Harem of Lust"}</div>
                <nav class="nav">
                    <A href="/combos">{"Combos"}</A>
                    <A href="/scores">{"Scores"}</A>
                </nav>
                <div style={{ "opacity": 0, "user-select": "none" }}>{"Harem of Lust"}</div>
            </div>
            <div class="content">{props.children}</div>
        </>
    );
};

export const App = () => {
    return (
        <div id="app" class="app">
            <Router>
                <Route path="/" component={Layout}>
                    <Route path="/" component={() => <Navigate href="/combos" />} />
                    <Route path="/combos" component={CombosPage} />
                    <Route path="/scores" component={ScoresPage} />
                </Route>
            </Router>
        </div>
    );
};
