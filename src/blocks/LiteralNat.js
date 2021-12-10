import {literalBlock} from '../block-patterns/literal-patterns';
import {natType} from '../block-types/types';

const block = literalBlock({
    title: 'Natural Number',
    customSearch(text) {
        const value = parseInt(text);
        if(value >= 0) {
            return {
                title: value,
                data: {
                    value,
                },
            };
        }
    },
}, natType);
export default block;
