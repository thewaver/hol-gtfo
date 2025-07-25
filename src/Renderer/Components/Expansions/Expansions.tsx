import { For, ParentProps } from "solid-js";

import { ALL_EXPANSIONS } from "../../../Logic/Abstracts/Card/Card.const";
import { AppStore } from "../../App.store";
import { ExpansionsProps } from "./Expansions.types";

export const Expansions = (props: ParentProps<ExpansionsProps>) => {
    return (
        <>
            <For each={[...ALL_EXPANSIONS.keys()]}>
                {(expansion) => (
                    <label>
                        <input
                            type="checkbox"
                            value={expansion}
                            checked={AppStore.getExpansions().has(expansion)}
                            onChange={() =>
                                AppStore.setExpansuions((prev) => {
                                    const next = new Set(prev);

                                    if (next.has(expansion)) {
                                        next.delete(expansion);
                                    } else {
                                        next.add(expansion);
                                    }

                                    return next;
                                })
                            }
                        />
                        {expansion}
                    </label>
                )}
            </For>
        </>
    );
};
