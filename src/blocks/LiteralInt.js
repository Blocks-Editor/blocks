import {literalBlock} from '../block-patterns/literal-patterns';
import {intType} from '../block-types/types';

const block = literalBlock({
    title: 'Integer',
    customSearch(text) {
        const value = +text;
        if(value % 1 === 0) {
            return {
                title: value,
                data: {
                    value,
                },
            };
        }
    },
}, intType);
export default block;
