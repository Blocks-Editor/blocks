import {asyncType, valueType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';

const block = {
    title: '(async a)',
    info: 'Retrieve a value asynchronously',
    category: operatorCategory,
    topRight: 'result',
    inputs: [{
        key: 'input',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: asyncType,
        inferType({input}) {
            return asyncType.of(input);
        },
        toMotoko({input}) {
            return `(async ${input})`;
        },
    }],
};
export default block;
