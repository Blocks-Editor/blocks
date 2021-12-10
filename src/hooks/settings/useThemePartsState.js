import useLocalStorage from '../utils/useLocalStorage';

export default function useThemePartsState() {
    return useLocalStorage('blocks.themeParts', {});
}
