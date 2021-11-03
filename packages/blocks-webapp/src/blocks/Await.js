import {asyncType, valueType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';

const block = {
    title: '(await a)',
    info: 'Wait for an asynchronous value',
    category: operatorCategory,
    topRight: 'result',
    inputs: [{
        key: 'input',
        type: asyncType,
    }],
    outputs: [{
        key: 'result',
        type: valueType,
        inferType({input}) {
            return input.generics[0];
        },
        toMotoko({input}) {
            return `(await ${input})`;
        },
    }],
};
export default block;
