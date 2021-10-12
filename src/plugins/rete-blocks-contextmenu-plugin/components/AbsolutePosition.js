import React, {useMemo, useCallback} from 'react';

export default function AbsolutePosition({x, y, maxHeight, children, style: styleProp, ...others}) {
    const style = useMemo(() => ({
        position: 'absolute',
        left: x,
        top: y,
        bottom: 0,/////
        ...styleProp,
    }), [x, y, styleProp]);

    const bindScreen = useCallback(el => {
        if(!el) {
            return;
        }
        const listener = event => event.stopPropagation();
        el.addEventListener('pointermove', listener);
        el.addEventListener('mousemove', listener);
        el.addEventListener('wheel', listener);
    }, []);

    return (
        <div
            className="context-menu-capture"
            style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'all'}}
            ref={bindScreen}
            {...others}>
            <div style={style}>
                {children}
            </div>
        </div>
    );
};
