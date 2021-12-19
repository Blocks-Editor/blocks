import useLocalStorage from '../utils/useLocalStorage';
import useThemes from '../useThemes';
import getQueryConfig from '../../utils/getEmbedConfig';
import {useCallback} from 'react';
import {THEMES} from '../../editor/themes';

const defaultTheme = THEMES[0];

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', getQueryConfig('theme', defaultTheme.id));

    return [
        themes.find(theme => theme.id === id) || defaultTheme,
        useCallback(id => setId(id), [setId]),
    ];
}
