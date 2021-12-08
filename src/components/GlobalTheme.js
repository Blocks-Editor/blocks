import useThemeState from '../hooks/settings/useThemeState';
import {useEffect} from 'react';
import {ThemeProvider} from 'styled-components';

export default function GlobalTheme({children}) {

    const [theme] = useThemeState();

    const classNames = [`theme-${theme.id}`, ...theme.parts.map(part => `theme-part-${part}`)];

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