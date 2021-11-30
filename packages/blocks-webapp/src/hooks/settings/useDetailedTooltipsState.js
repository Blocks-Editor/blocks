import useLocalStorage from '../utils/useLocalStorage';

export default function useDetailedTooltipsState() {
    return useLocalStorage('blocks.detailedTooltips', false);
}
