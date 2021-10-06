import {useMemo} from 'react';
import useContextComparator from './useContextComparator';

function calcHash(components) {
    let retVal = '';

    components.forEach((c) => {
        retVal += `${c.name}#_#`;
    });

    return retVal;
}

function calcContextHash(context) {
    if(!context) return null;

    return `${context.input ? 'true' : 'false'}_${context.output ? 'true' : 'false'}_${context.socket.name}`;
}

export default function useComponents(editor, context) {
    const hash = calcHash(editor.components);
    const contextHash = calcContextHash(context);
    const contextComparator = useContextComparator();

    return useMemo(() => {
        let array = Array.from(editor.components.values());

        if(context?.socket && (context?.output || context?.input)) {
            array = array.filter(c => contextComparator(context, c));
        }

        array.sort((a, b) => a.name.localeCompare(b.name));
        return array;
    }, [hash, contextHash, contextComparator]); /* eslint-disable-line react-hooks/exhaustive-deps */
}
