import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {customType, typeType, valueType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';

const block = {
    title: '{ Type }',
    info: 'A custom type expression written in Motoko',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    topRight: 'result',
    width: 14,
    inputs: [
        expressionArgsInput(/* typeType */),
        {
            key: 'type',
            type: typeType.of(valueType),
        },
    ],
    outputs: [{
        key: 'result',
        type: typeType.of(valueType),
        inferType({type}) {
            return type || customType; // TODO: distinct customType
        },
        toMotoko({inputs, expression}) {
            return parseCodeBlockInputs(inputs, expression);
        },
    }],
    controls: [
        expressionControl(),
    ],
};
export default block;
