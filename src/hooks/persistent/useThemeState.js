import useLocalStorage from '../utils/useLocalStorage';
import useThemes from '../useThemes';
import getQueryConfig from '../../utils/getEmbedConfig';
import {useCallback} from 'react';

const defaultTheme = 2;

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', getQueryConfig('theme', themes[defaultTheme].id));

    return [
        themes.find(theme => theme.id === id) || themes[defaultTheme],
        useCallback(id => setId(id), [setId]),
    ];
}
