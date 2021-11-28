import useLocalStorage from '../useLocalStorage';

export default function useDetailedTooltipsState() {
    return useLocalStorage('blocks.detailedTooltips', false);
}
