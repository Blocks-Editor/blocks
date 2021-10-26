import {capitalCase} from 'change-case';

export default function getBlockLabel(block) {
    if(!block) {
        return '';
    }
    return block.title || capitalCase(block.name);
}