import useLocalStorage from '../utils/useLocalStorage';
import getQueryConfig from '../../utils/getQueryConfig';
import isEmbeddedMode from '../../utils/isEmbeddedMode';

export const LEARNING = 'learning';
export const FAMILIAR = 'familiar';

export default function useFamiliarityState() {
    let familiarityConfig = getQueryConfig('familiarity', isEmbeddedMode() ? 'familiar' : null);
    if(familiarityConfig === 'none') {
        familiarityConfig = null;
    }

    return useLocalStorage('blocks.familiarity', familiarityConfig);
}
