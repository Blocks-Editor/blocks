import useLocalStorage from '../utils/useLocalStorage';
import useThemes from '../useThemes';

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', themes[0].id);

    return [
        themes.find(theme => theme.id === id) || themes[0],
        id => setId(id),
    ];
}
