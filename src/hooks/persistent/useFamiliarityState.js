import useLocalStorage from '../utils/useLocalStorage';

export default function useFamiliarityState() {
    return useLocalStorage('blocks.familiarity', null);
}
