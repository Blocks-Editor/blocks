import {makeLocalStorageObservable} from '../utils/useLocalStorage';
import useThemes from '../useThemes';
import getEmbedConfig from '../../utils/getEmbedConfig';
import {useCallback} from 'react';
import useObservableState from '../utils/useObservableState';

export const THEME_STORE = makeLocalStorageObservable('blocks.theme', getEmbedConfig('theme'));

export default function useThemeState() {
    const themes = useThemes();
    const [id, setId] = useObservableState(THEME_STORE);

    return [
        themes.find(theme => theme.id === id) || themes[0],
        useCallback(id => setId(id), [setId]),
    ];
}
