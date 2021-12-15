import useLocalStorage from '../utils/useLocalStorage';
import useThemes from '../useThemes';

const defaultTheme = 2;

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', themes[defaultTheme].id);

    return [
        themes.find(theme => theme.id === id) || themes[defaultTheme],
        id => setId(id),
    ];
}
