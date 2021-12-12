import {literalBlock} from '../block-patterns/literal-patterns';
import {textType} from '../block-types/types';

const block = literalBlock({
    title: 'Text',
    customSearch(text) {
        if(text.startsWith('"') || text.startsWith('\'')) {
            text = text.slice(1);
            if(text.endsWith('"') || text.endsWith('\'')) {
                text = text.slice(-1);
            }
            return {
                title: `"${text}"`,
                data: {
                    value: text,
                },
            };
        }
    },
}, textType, JSON.stringify);
export default block;
