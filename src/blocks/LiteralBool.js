import {literalBlock} from '../block-patterns/literal-patterns';
import {boolType} from '../block-types/types';

const block = literalBlock({
    title: 'Boolean',
    customSearch(text) {
        if(!text) {
            return;
        }
        for(let value of [true, false]) {
            let title = String(value);
            if(title.startsWith(text.toLowerCase())) {
                return {
                    title,
                    data: {
                        value,
                    },
                };
            }
        }
    },
}, boolType);
export default block;