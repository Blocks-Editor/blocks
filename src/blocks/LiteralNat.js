import {literalBlock} from '../block-patterns/literal-patterns';
import {natType} from '../block-types/types';

const block = literalBlock({
    title: 'Natural Number',
    customSearch(text) {
        if(text.startsWith('-')) {
            return;
        }
        const value = +text;
        if(value >= 0 && value % 1 === 0) {
            return {
                title: value,
                priority: 3,
                data: {
                    value,
                },
            };
        }
    },
}, natType);
export default block;
