import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {typeType, valueType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {formatCurlyBraces} from '../editor/format/formatHelpers';

const block = {
    title: '{ Expression }',
    info: 'Compile an arbitrary expression',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    topRight: 'result',
    width: 14,
    inputs: [
        expressionArgsInput(),
        {
            key: 'type',
            type: typeType.of(valueType),
        },
    ],
    outputs: [{
        key: 'result',
        type: valueType,
        inferType({type}) {
            // return parseInputs(inputs, typeCode);
            return type;
        },
        toMotoko({inputs, expression}) {
            return `do ${formatCurlyBraces(parseCodeBlockInputs(inputs, expression))}`;
        },
    }],
    controls: [
        expressionControl(),
    ],
};
export default block;
