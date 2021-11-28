import useLocalStorage from '../useLocalStorage';

export default function useThemeState() {
    return useLocalStorage('blocks.theme', 'dark');
}
