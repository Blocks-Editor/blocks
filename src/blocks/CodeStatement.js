import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {statementBlock} from '../block-patterns/statement-patterns';
import {typeType, valueType} from '../block-types/types';

const block = statementBlock({
    title: '{ Statement }',
    info: 'A custom statement written in Motoko',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    // topRight: 'result',
    width: 14,
    inputs: [
        expressionArgsInput(),
        {
            key: 'type',
            type: typeType.of(valueType),
        },
    ],
    controls: [
        expressionControl(),
    ],
}, ({inputs, expression}) => {
    return parseCodeBlockInputs(inputs, expression) || '';
}, ({type}) => {
    return type;
});
export default block;
