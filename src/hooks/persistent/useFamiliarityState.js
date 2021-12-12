import useLocalStorage from '../utils/useLocalStorage';

export const LEARNING = 'learning';
export const FAMILIAR = 'familiar';

export default function useFamiliarityState() {
    return useLocalStorage('blocks.familiarity', null);
}
