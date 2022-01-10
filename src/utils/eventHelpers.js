function onEvents(eventKeys, listenerFn) {
    let currentKey;
    let timeout;
    const result = {};
    eventKeys.forEach(key => {
        result[key] = (event) => {
            // Prevent firing multiple times under different event names
            if(currentKey && currentKey !== key) {
                return;
            }
            currentKey = key;
            if(timeout === undefined) {
                timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    timeout = undefined;
                    currentKey = undefined;
                });
            }
            return listenerFn(event);
        };
    });
    return result;
}

export function onAnyClick(listenerFn) {
    return {
        onClick: listenerFn,
    };
}

export function onLeftClick(listenerFn) {
    return onAnyClick(event => {
        if(event.button === undefined || event.button === 0) {
            return listenerFn(event);
        }
    });
}

export function onAnyPress(listenerFn) {
    return onEvents(['onMouseDown', 'onTouchStart'], listenerFn);
}

export function onAnyRelease(listenerFn) {
    return onEvents(['onMouseUp', 'onTouchEnd'], listenerFn);
}

export function onLeftPress(listenerFn) {
    return onAnyPress(event => {
        if(event.button === undefined || event.button === 0) {
            return listenerFn(event);
        }
    });
}