import {makeLocalStorageObservable} from '../utils/useLocalStorage';
import useObservableState from '../utils/useObservableState';

// TODO: move to `src/observables`?
export const OUTPUT_PANEL_STATE = makeLocalStorageObservable('blocks.outputPanel', null);

export default function useOutputPanelState() {
    return useObservableState(OUTPUT_PANEL_STATE);
}
