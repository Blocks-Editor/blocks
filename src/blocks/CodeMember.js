import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {memberType} from '../block-types/types';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {memberBlock} from '../block-patterns/member-patterns';
import {CODE_PRIORITY} from '../compilers/utils/compileGlobalMotoko';

const block = memberBlock({
    title: '{ Member }',
    info: 'Compile an arbitrary member',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    width: 14,
    memberPriority: CODE_PRIORITY,
    inputs: [
        expressionArgsInput(),
    ],
    controls: [
        expressionControl(),
    ],
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
