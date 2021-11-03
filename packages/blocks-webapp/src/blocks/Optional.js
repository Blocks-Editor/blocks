import {optionalType, valueType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';

const block = {
    title: '(?a)',
    info: 'Create an optional version of the input value',
    category: operatorCategory,
    topRight: 'result',
    inputs: [{
        key: 'input',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: optionalType,
        inferType({input}) {
            return optionalType.of(input);
        },
        toMotoko({input}) {
            return `(?${input})`;
        },
    }],
};
export default block;
