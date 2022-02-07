import React, {useCallback, useMemo} from 'react';
import {isMobile} from 'react-device-detect';
import {onLeftClick} from '../../../utils/eventHelpers';
import classNames from 'classnames';

export default function ContextMenu({x, y, mobileElevated, style: styleProp, handleCloseMenu, children, ...others}) {

    const style = useMemo(() => ({
        zIndex: 500,
        position: 'absolute',
        left: isMobile ? 150 : x,
        top: isMobile ? mobileElevated ? 150 : 250 : y,
        boxShadow: isMobile && '0 2px 10px #000E',
        pointerEvents: 'all',
        ...styleProp,
    }), [x, y, mobileElevated, styleProp]);

    const bindScreen = useCallback(el => {
        if(!el) {
            return;
        }
        const listener = event => event.stopPropagation();
        el.addEventListener('mousedown', listener);
        el.addEventListener('touchstart', listener);
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

    return (
        <div
            className="context-menu-screen"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                pointerEvents: 'none',/*touch ? 'none' : 'all'*/
            }}
            ref={bindScreen}
            onKeyDown={e => e.keyCode === 27 /* escape */ && handleCloseMenu()}
            {...onLeftClick(handleCloseMenu)}
            {...others}>
            <div className="context-menu-container" style={style} ref={bindContainer}>
                <div className={classNames('context-menu', isMobile && 'mobile')}>
                    {children}
                </div>
            </div>
        </div>
    );
}
