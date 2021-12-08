import {parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {anyType, referenceType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';

const block = {
    title: '{ Reference }',
    info: 'Compile an arbitrary reference',
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    topRight: 'result',
    width: 14,
    inputs: [{
        key: 'inputs',
        type: anyType,
        multi: true,
    }],
    outputs: [{
        key: 'result',
        type: referenceType,
        toMotoko({inputs, expression}) {
            return parseCodeBlockInputs(inputs, expression);
        },
    }],
    controls: [{
        key: 'expression',
        config: {
            controlType: CodeControlHandle,
        },
    }],
};
export default block;
