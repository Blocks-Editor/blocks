import {parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {customType, typeType, valueType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';

const block = {
    title: `{Type}`,
    info: `Compile an arbitrary Type expression`,
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    topRight: 'result',
    className: 'node-wide',
    inputs: [{
        key: 'inputs',
        type: typeType,
        multi: true,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
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
    controls: [{
        key: 'expression',
        config: {
            controlType: CodeControlHandle,
        },
    }],
};
export default block;
