import useLocalStorage from '../utils/useLocalStorage';
import useThemes from '../useThemes';

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', 'dark');

    return [
        themes.find(theme => theme.id === id) || themes[0],
        id => setId(id),
    ];
}
