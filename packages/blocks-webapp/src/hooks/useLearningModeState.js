import makeObservable from '../utils/makeObservable';
import useObservableState from './useObservableState';

// TODO: eventually switch to global store such as Redux
const learningModeStore = makeObservable(false);

export default function useLearningModeState() {
    return useObservableState(learningModeStore);
}
