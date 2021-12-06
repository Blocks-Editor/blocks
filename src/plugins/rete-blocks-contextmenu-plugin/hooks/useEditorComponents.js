import {useMemo} from 'react';

export default function useEditorComponents(editor, sortFn) {
    const hash = [...editor.components].map(c => c.name).join('##');

    return useMemo(() => {
        return [...editor.components.values()]
            .filter(c => c && 'block' in c && !c.block?.hidden && !c.block?.deprecated)// TODO: refactor?
            .map(v => [sortFn(v), v])
            .sort(([a], [b]) => {
                if(Array.isArray(a)) {
                    for(let i = 0; i < a.length; i++) {
                        let compare = typeof a[i] === 'number'
                            ? a[i] - b[i]
                            : a[i].localeCompare(b[i]);
                        if(compare !== 0) {
                            return compare;
                        }
                    }
                    return 0;
                }
                else {
                    return a.localeCompare(b);
                }
            })
            .map(([, v]) => v);
    }, [hash]); /* eslint-disable-line react-hooks/exhaustive-deps */
}