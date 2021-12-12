import useListener from '../hooks/utils/useListener';
import {KEY_DOWN_STORE} from '../observables/keyDownStore';
import {KEY_UP_STORE} from '../observables/keyUpStore';

// Misc. global observable state manager

export default function GlobalObservables() {

    useListener(document, 'keydown', event => {
        KEY_DOWN_STORE.set(event.key);
    });
    useListener(document, 'keyup', event => {
        KEY_UP_STORE.set(event.key);
    });

    return null;
}