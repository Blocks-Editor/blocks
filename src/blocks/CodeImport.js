import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {referenceType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';

const block = {
    title: '{ Import }',
    info: 'Import statement(s) written in Motoko',
    topRight: 'result',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    width: 14,
    inputs: [
        expressionArgsInput(),
    ],
    outputs: [{
        key: 'result',
        type: referenceType,
        hidden: true,////
        toMotoko({inputs, expression}) {
            return parseCodeBlockInputs(inputs, expression);
        },
    }],
    controls: [
        expressionControl(),
    ],
};
export default block;
