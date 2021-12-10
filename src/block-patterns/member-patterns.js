import {identifierType, memberType} from '../block-types/types';
import {stringSelectProp} from './control-patterns';


export function computeMemberName(node, editor) {
    return editor.compilers.motoko.getInput(node, 'name');

    // let name = editor.compilers.motoko.getInput(node, 'name');
    // if(!name) {
    //     return;
    // }
    // if(!parentNode) {
    //     return name;
    // }
    // let actorName = editor.compilers.motoko.getInput(parentNode, 'name');
    // return actorName?`${actorName}.${name}`:name;
}

export function visibilityControlProp() {
    return stringSelectProp({
        key: 'visibility',
        advanced: true,
        // optional: true,
    }, ['public', 'private', 'system']);
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
    };
}