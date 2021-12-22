import isEmbeddedMode from './isEmbeddedMode';
import getQueryConfig from './getQueryConfig';

export default function getEmbedConfig(key, defaultValue) {
    return isEmbeddedMode() ? getQueryConfig(key, defaultValue) : defaultValue;
}
