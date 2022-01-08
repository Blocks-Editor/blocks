import {useCallback} from 'react';
import {isMobile} from 'react-device-detect';

export default function MenuSearch({value, onChange, onAction, onKeyDown, children, ...others}) {

    const bindInput = useCallback(el => {
        if(!el) {
            return;
        }
        el.focus();
        // el.select();
    }, [{}/* Force redraw in order to refocus */]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const handleKeyDown = (onKeyDown || onAction) && (event => {
        if(onKeyDown) {
            onKeyDown(event);
        }
        if(onAction && event.key === 'Enter') {
            onAction();
        }
    });

    return (
        <div onMouseDown={event => event.stopPropagation()}>
            <input
                type="text"
                className="context-menu-search"
                autoFocus
                ref={bindInput}
                autoComplete="blocks-search"
                value={value || ''}
                onChange={onChange && (event => onChange(event.target.value))}
                onKeyDown={handleKeyDown}
                {...others}/>
            <div className="context-menu-search-area" style={{maxHeight: isMobile ? '15rem' : '25rem'}}>
                {children}
            </div>
        </div>
    );
}
