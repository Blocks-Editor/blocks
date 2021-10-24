import {literalCategory} from '../block-categories/categories';

export function literalBlock(title, type, stringifier) {
    return {
        title: title,
        category: literalCategory,
        topRight: 'value',
        outputs: [{
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