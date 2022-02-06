import {expressionArgsInput, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {referenceType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import TextControlHandle from '../components/rete/controls/TextControlHandle';

const block = {
    title: '{ Reference }',
    info: 'An arbitrary code reference',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    topRight: 'result',
    // width: 8,
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
        // expressionControl({height: 24, options: {lineNumbers: 'off'}}),
        {
            key: 'expression',
            config: {
                controlType: TextControlHandle,
                validation: {
                    minLength: 1,
                },
            },
        },
    ],
};
export default block;
