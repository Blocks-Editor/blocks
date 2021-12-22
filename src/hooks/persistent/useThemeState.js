import useLocalStorage, {makeLocalStorageObservable} from '../utils/useLocalStorage';
import useThemes from '../useThemes';
import getEmbedConfig from '../../utils/getEmbedConfig';
import {useCallback} from 'react';
import {THEMES} from '../../editor/themes';


const defaultTheme = THEMES[0];

export const THEME_STORE = makeLocalStorageObservable(getEmbedConfig('theme', defaultTheme.id));

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useLocalStorage('blocks.theme', THEME_STORE);

    return [
        themes.find(theme => theme.id === id) || defaultTheme,
        useCallback(id => setId(id), [setId]),
    ];
}
