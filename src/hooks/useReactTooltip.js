import ReactTooltip from 'react-tooltip';

let timeout;

// Rebuild react-tooltip
export default function useReactTooltip() {
    if(timeout === undefined) {
        timeout = setTimeout(() => {
            timeout = undefined;
            ReactTooltip.rebuild();
        });
    }
    return ReactTooltip;
}
