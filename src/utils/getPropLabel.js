import getDefaultLabel from './getDefaultLabel';

export default function getPropLabel(prop) {
    if(!prop) {
        return '';
    }
    return prop.title || getDefaultLabel(prop.key);
}