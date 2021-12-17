import {parse} from 'querystring';
import isEmbedded from './isEmbedded';

const config = isEmbedded() ? parse(window.location.search.substring(1)) : {};

export default function getEmbedConfig(key, defaultValue) {
    return config.hasOwnProperty(key) ? config[key] : defaultValue;
}
