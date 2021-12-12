import useLocalStorage from '../utils/useLocalStorage';

export default function useAutosaveState() {
    return useLocalStorage('blocks.autosave', true);
}
