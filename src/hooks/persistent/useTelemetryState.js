import {makeLocalStorageObservable} from '../utils/useLocalStorage';
import useObservableState from '../utils/useObservableState';

export const TELEMETRY_STORE = makeLocalStorageObservable('blocks.telemetry', null);

export default function useTelemetryState() {
    return useObservableState(TELEMETRY_STORE);
}
