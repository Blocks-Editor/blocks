import {sentenceCase} from 'change-case';

export default function getDefaultLabel(text) {
    if(!text) {
        return '';
    }
    return sentenceCase(text);
}