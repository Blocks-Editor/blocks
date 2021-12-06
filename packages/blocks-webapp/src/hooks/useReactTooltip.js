import {useEffect} from 'react';
import ReactTooltip from 'react-tooltip';

let timeout;

// Rebuild react-tooltip
export default function useReactTooltip(deps = []) {
    useEffect(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => ReactTooltip.rebuild());
    }, deps); /* eslint-disable-line react-hooks/exhaustive-deps */

    return ReactTooltip;
}
