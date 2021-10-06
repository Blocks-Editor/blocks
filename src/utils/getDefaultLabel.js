import {sentenceCase} from 'change-case';

export default function getDefaultLabel(text) {
    return sentenceCase(text);
}