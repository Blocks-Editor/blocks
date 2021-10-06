import React, {useMemo, useCallback} from 'react';

const MenuPositioner = ({root, x, y, children, style: styleProp, editor}) => {
    const style = useMemo(() => ({
        ...styleProp,
        position: 'absolute',
        top: y,
        left: x,
    }), [styleProp, x, y]);

    const handleRef = useCallback((r) => {
        if(!r) {
            return;
        }

        r.addEventListener('pointermove', (event) => {
            event.stopPropagation();
        });

        r.addEventListener('mousemove', (event) => {
            event.stopPropagation();
        });

        r.addEventListener('wheel', (event) => {
            event.stopPropagation();
        });
    }, []);

    const handleClose = useCallback(() => {
        if(editor) {
            editor.trigger('hidecontextmenu');
        }
    }, [editor]);

    return (
        <>
            <div
                style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'all'}}
                onClick={handleClose}
                ref={handleRef}
            >
                <div
                    style={style}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

MenuPositioner.propTypes = {};

export default MenuPositioner;
