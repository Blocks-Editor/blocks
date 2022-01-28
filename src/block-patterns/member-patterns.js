import {memberType} from '../block-types/types';
import {stringSelectProp} from './control-patterns';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';


export function getUserDefinedName(node, editor) {
    const name = editor.compilers.motoko.getInput(node, 'name');
    if(name && name !== nodeIdentifierRef(node, 'name') /* Default identifier */) {
        return name;
    }
}

export function visibilityControlProp() {
    return stringSelectProp({
        key: 'visibility',
        info: 'Whether this function is callable from outside of its actor, class, object, or module',
        advanced: true,
        // optional: true,
    }, ['public', 'private', 'system']);
}

export function memberBlock(block, memberProp) {
    return {
        topLeft: 'member',
        ...block,
        // inputs: [
        //     {
        //         key: 'name',
        //         type: identifierType,
        //     },
        //     ...block.inputs || [],
        // ],
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