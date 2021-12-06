import {getBlock} from '../editor/blocks';
import getBlockLabel from './getBlockLabel';

export default function getNodeLabel(node, editor, simplified) {
    let block = getBlock(node.name);
    if(!simplified && block && block.computeTitle) {
        let title = block.computeTitle(node, editor);
        if(title) {
            return title;
        }
    }
    return getBlockLabel(block);
}