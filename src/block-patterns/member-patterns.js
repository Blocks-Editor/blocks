import {memberType} from '../block-types/types';
import {stringSelectProp} from './control-patterns';


export function memberBlock(block, memberProp) {
    return {
        topLeft: 'member',
        ...block,
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