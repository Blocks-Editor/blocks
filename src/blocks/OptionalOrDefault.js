import {optionalType, valueType} from '../block-types/types';
import {decompositionCategory} from '../block-categories/categories';
import {FOR_ERROR_HANDLING} from '../editor/useCases';
import {importRef} from '../compilers/MotokoCompiler';
import {formatParentheses} from '../editor/format/formatHelpers';

export const optionImportRef = importRef('mo:base/Option');

const block = {
    title: 'Optional or Default',
    info: 'Unwrap an optional value, falling back to a default if null',
    useCases: [FOR_ERROR_HANDLING],
    category: decompositionCategory,
    topRight: 'value',
    inputs: [{
        key: 'input',
        type: optionalType,
    }, {
        key: 'defaultValue',
        title: 'Default',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({input}) {
            if(optionalType.isSubtype(input)) {
                return input.generics[0];
            }
        },
        toMotoko({input, defaultValue}) {
            return `${optionImportRef}.get${formatParentheses(`${input}, ${defaultValue}`)}`;
        },
    }],
};
export default block;