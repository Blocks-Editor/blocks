import {useEffect} from 'react';

export default function useListener(target, event, listener, options) {
    useEffect(() => {
        if(!target) {
            return;
        }
        const domTarget = 'addEventListener' in target;
        if(domTarget) {
            target.addEventListener(event, listener, options);
        }
        else {
            target.on(event, listener, options);
        }
        return () => {
            if(domTarget) {
                target.removeEventListener(event, listener);
            }
            else {
                target.off(event, listener);
            }
        };
    });
    return listener;
}