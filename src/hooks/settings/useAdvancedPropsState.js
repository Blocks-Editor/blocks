import useLocalStorage from '../utils/useLocalStorage';

export default function useAdvancedPropsState() {
    return useLocalStorage('blocks.advancedProps', false);
}
