import {literalBlock} from '../block-patterns/literal-patterns';
import {floatType} from '../block-types/types';

const block = literalBlock({
    title: 'Float',
    customSearch(text) {
        const value = +text;
        if(!isNaN(value)) {
            return {
                title: value,
                data: {
                    value,
                },
            };
        }
    },
}, floatType);
export default block;