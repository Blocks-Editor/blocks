import {parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {memberType, typeType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import CodeControlHandle from '../components/rete/controls/CodeControlHandle';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {memberBlock} from '../block-patterns/member-patterns';

const block = memberBlock({
    title: '{ Member }',
    info: 'Compile an arbitrary member',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    width: 14,
    inputs: [{
        key: 'inputs',
        type: typeType,
        multi: true,
    }],
    controls: [{
        key: 'expression',
        config: {
            controlType: CodeControlHandle,
        },
    }],
}, {
    type: memberType,
    toMotoko({inputs, expression}) {
        let result = parseCodeBlockInputs(inputs, expression)?.trimRight();
        if(result && !result.endsWith(';')) {
            result += ';';
        }
        return result;
    },
});
export default block;
