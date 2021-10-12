import {useMemo} from 'react';

export default function useEditorComponents(editor, sortFn) {
    const hash = [...editor.components].map(c => c.name).join('##');

    return useMemo(() => {
        return [...editor.components.values()]
            .map(v => [sortFn(v), v])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, v]) => v);
    }, [hash]); /* eslint-disable-line react-hooks/exhaustive-deps */
}
