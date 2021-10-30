import {useCallback} from 'react';

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
        if(onAction && event.keyCode === 13 /* Enter */) {
            onAction();
        }
    });

    return (
        <>
            <input
                type="text"
                className="context-menu-search"
                autoFocus
                ref={bindInput}
                autoComplete="blocks-search"
                value={value || ''}
                onClick={event => event.stopPropagation()}
                onChange={onChange && (event => onChange(event.target.value))}
                onKeyDown={handleKeyDown}
                {...others}/>
            <div className="context-menu-search-area">
                {children}
            </div>
        </>
    );
}