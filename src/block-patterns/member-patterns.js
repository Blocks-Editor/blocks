import {identifierType, memberType} from '../block-types/types';
import {stringSelectProp} from './control-patterns';


export function computeMemberName(node, editor) {
    let name = editor.compilers.motoko.getInput(node, 'name');
    if(!name) {
        return;
    }
    let actorNode = editor.compilers.node.getInput(node, 'member');
    if(!actorNode) {
        return name;
    }
    let actorName = editor.compilers.motoko.getInput(actorNode, 'name');
    return `${actorName}.${name}`;
}

export function memberBlock(block, memberProp) {
    return {
        topLeft: 'member',
        ...block,
        inputs: [
            {
                key: 'name',
                type: identifierType,
            },
            ...block.inputs || [],
        ],
        outputs: [
            {
                key: 'member',
                type: memberType,
                ...memberProp,
            },
            ...block.outputs || [],
        ],
        controls: [
            stringSelectProp({
                key: 'visibility',
                // optional: true,
            }, ['public', 'private', 'system']),
            ...block.controls || [],
        ],
    };
}