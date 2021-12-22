import {parse} from 'querystring';

const config = parse(window.location.search.substring(1));

export default function getQueryConfig(key, defaultValue) {
    return key in config ? config[key] : defaultValue;
}
