import {literalBlock} from '../block-patterns/literal-patterns';
import {floatType, textType, typeType} from '../block-types/types';
import {literalCategory} from '../block-categories/categories';

const block = {
    title: 'Custom Number',
    info: 'A configurable number value',
    category: literalCategory,
    topRight: 'value',
    inputs: [{
        key: 'input',
        title: 'Number',
        type: textType,
    }, {
        key: 'type',
        type: typeType.of(floatType),
    }],
    outputs: [{
        key: 'value',
        type: floatType,
        toMotoko({input}) {
            if(!input) {
                return;
            }
            return input;
        },
        inferType({type}) {
            return type;
        },
    }],
};


literalBlock({
    customSearch(text) {
        const value = +text;
        if(!isNaN(value)) {
            return {
                title: value,
                priority: 1,
                data: {
                    value,
                },
            };
        }
    },
}, floatType);
export default block;