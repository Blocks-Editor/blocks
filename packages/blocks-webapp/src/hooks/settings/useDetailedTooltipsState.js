import makeObservable from '../../utils/makeObservable';
import useObservableState from '../useObservableState';

// TODO: refactor to global store
const setting = makeObservable(false);

export default function useDetailedTooltipsState() {
    return useObservableState(setting);
}
