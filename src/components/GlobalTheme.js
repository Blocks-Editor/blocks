import useThemeState from '../hooks/settings/useThemeState';
import {useEffect} from 'react';

export default function GlobalTheme() {

    const [theme] = useThemeState();

    const classNames = [`theme-${theme.id}`, ...theme.parts.map(part => `theme-part-${part}`)];

    useEffect(() => {
        document.body.classList.add(...classNames);
        return () => document.body.classList.remove(...classNames);
    });

    return null;
}