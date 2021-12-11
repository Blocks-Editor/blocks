import useLocalStorage from '../utils/useLocalStorage';

export default function useTutorialProgressState() {
    return useLocalStorage('blocks.tutorialProgress', null);
}
