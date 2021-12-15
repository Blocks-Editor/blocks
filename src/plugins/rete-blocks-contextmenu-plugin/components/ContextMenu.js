import React, {useCallback, useMemo} from 'react';
import useReactTooltip from '../../../hooks/useReactTooltip';

export default function ContextMenu({x, y, children, style: styleProp, handleCloseMenu, ...others}) {

    const style = useMemo(() => ({
        position: 'absolute',
        left: x,
        top: y,
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

    const bindContainer = useCallback(el => {
        if(!el) {
            return;
        }
        const moveIntoWindow = () => {
            let offset = el.getBoundingClientRect().bottom - window.innerHeight;
            if(offset > 0) {
                el.style.top = `${y - offset}px`;
            }
        };
        moveIntoWindow();
        el.onresize = moveIntoWindow;
    }, [y]);

    // Fix initial tooltip value
    useReactTooltip();

    return (
        <div
            className="context-menu-screen"
            style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'all'}}
            ref={bindScreen}
            onKeyDown={e => e.keyCode === 27 /* escape */ && handleCloseMenu()}
            onMouseDown={() => handleCloseMenu()}
            {...others}>
            <div className="context-menu-container" style={style} ref={bindContainer}>
                <div className="context-menu">
                    {children}
                </div>
            </div>
        </div>
    );
}
