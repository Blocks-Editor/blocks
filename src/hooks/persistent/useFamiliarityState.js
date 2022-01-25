import useLocalStorage from '../utils/useLocalStorage';
import getQueryConfig from '../../utils/getQueryConfig';
import isEmbeddedMode from '../../utils/isEmbeddedMode';

export const LEARNING = 'learning';
export const FAMILIAR = 'familiar';

export default function useFamiliarityState() {
    let familiarityConfig = getQueryConfig('familiarity', isEmbeddedMode() ? true : null);
    if(familiarityConfig === 'true') {
        // Already started tutorial
        familiarityConfig = true;
    }
    else if(familiarityConfig === 'none') {
        // Suggest tutorial
        familiarityConfig = null;
    }
    else {
        // Skipped tutorial
        familiarityConfig = false;
    }
    return useLocalStorage('blocks.familiarity', familiarityConfig);
}
