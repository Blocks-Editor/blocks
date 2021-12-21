import {optionalType, valueType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';
import {FOR_ERROR_HANDLING} from '../editor/useCases';
import {formatOptionalParentheses} from '../editor/format/formatHelpers';

const block = {
    title: 'Optional (?a)',
    info: 'Create an optional version of the input value',
    useCases: [FOR_ERROR_HANDLING],
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
            return `?${formatOptionalParentheses(input)}`;
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
