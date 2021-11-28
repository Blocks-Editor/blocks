import makeObservable from '../../utils/makeObservable';
import useObservableState from '../useObservableState';

// TODO: refactor to global store
const setting = makeObservable('dark');

export default function useThemeState() {
    return useObservableState(setting);
}
