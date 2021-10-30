import {useEffect} from 'react';
import ReactTooltip from 'react-tooltip';

let interval;

// Rebuild react-tooltip
export default function useReactTooltip(deps = []) {
    useEffect(() => {
        clearInterval(interval);
        interval = setTimeout(() => ReactTooltip.rebuild());
    }, deps); /* eslint-disable-line react-hooks/exhaustive-deps */
}