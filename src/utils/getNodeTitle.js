import {BLOCK_MAP} from '../editor/blocks';
import getDefaultLabel from './getDefaultLabel';

export default function getNodeTitle(node, editor, simplified) {
    let block = BLOCK_MAP.get(node.name);
    if(!simplified && block && block.computeTitle) {
        return block.computeTitle(node, editor);
    }
    return node.meta.title || getDefaultLabel(node.name);
}