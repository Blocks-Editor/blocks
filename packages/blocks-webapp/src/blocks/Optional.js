import {optionalType, valueType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';

const block = {
    title: 'Wrap Optional (?a)',
    info: 'Create an optional version of the input value',
    category: operatorCategory,
    // topRight: 'result',
    inputs: [{
        key: 'input',
        title: 'Value',
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
    }, {
        key: 'null',
        type: optionalType,
        inferType({input}) {
            return optionalType.of(input);
        },
        toMotoko({input}) {
            return 'null';
        },
    }],
};
export default block;
