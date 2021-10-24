import {BLOCK_MAP} from '../editor/blocks';
import {capitalCase} from 'change-case';

export default function getNodeLabel(node, editor, simplified) {
    let block = BLOCK_MAP.get(node.name);
    if(!simplified && block && block.computeTitle) {
        return block.computeTitle(node, editor);
    }
    return node.meta.title || capitalCase(node.name);
}