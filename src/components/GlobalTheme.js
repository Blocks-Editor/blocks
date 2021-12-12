import useThemeState from '../hooks/persistent/useThemeState';
import {useEffect} from 'react';
import {ThemeProvider} from 'styled-components';
import useThemePartsState from '../hooks/persistent/useThemePartsState';

export default function GlobalTheme({children}) {

    const [theme] = useThemeState();
    const [themeParts] = useThemePartsState();

    const classNames = [`theme-${theme.id}`, ...theme.parts
        .filter(part => themeParts[part])
        .map(part => `theme-part-${part}`)];

    useEffect(() => {
        document.body.classList.add(...classNames);
        return () => document.body.classList.remove(...classNames);
    });

    return (
        <ThemeProvider theme={theme.styledComponents}>
            {children}
        </ThemeProvider>
    );
}