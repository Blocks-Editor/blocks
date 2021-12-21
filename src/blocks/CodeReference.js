import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {referenceType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';

const block = {
    title: '{ Reference }',
    info: 'Compile an arbitrary reference',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    topRight: 'result',
    width: 14,
    inputs: [
        expressionArgsInput(),
    ],
    outputs: [{
        key: 'result',
        type: referenceType,
        toMotoko({inputs, expression}) {
            return parseCodeBlockInputs(inputs, expression);
        },
    }],
    controls: [
        expressionControl(),
    ],
};
export default block;
