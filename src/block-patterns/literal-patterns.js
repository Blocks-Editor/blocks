import {literalCategory} from '../block-categories/categories';

export function literalBlock(block, type, stringifier) {
    return {
        category: literalCategory,
        topRight: 'value',
        ...block,
        outputs: [...block.outputs || [], {
            key: 'value',
            type,
            control: true,
            toMotoko({value}) {
                if(value === undefined) {
                    return;
                }
                return String(stringifier ? stringifier(value) : value);
            },
        }],
    };
}