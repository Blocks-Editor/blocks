import useLocalStorage from '../utils/useLocalStorage';

const defaultTheme = {
    // 'vibrant-borders': true, // TODO: refactor?
};

export default function useThemePartsState() {
    return useLocalStorage('blocks.themeParts', defaultTheme);
}
