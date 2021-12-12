import useLocalStorage from '../utils/useLocalStorage';

export default function useLearningModeState() {
    return useLocalStorage('blocks.learningMode', true);
}
