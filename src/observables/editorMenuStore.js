import makeObservable from '../utils/makeObservable';
import getQueryConfig from '../utils/getQueryConfig';
import {logTelemetry} from '../telemetry';

export const EDITOR_MENU_STORE = makeObservable(getQueryConfig('menu', null));

EDITOR_MENU_STORE.callAndSubscribe((menu, previous) => {
    // Skip if loading without menu
    if(!menu && !previous) {
        return;
    }
    logTelemetry(menu ? 'menu_open' : 'menu_close', {interaction: menu || previous});
})