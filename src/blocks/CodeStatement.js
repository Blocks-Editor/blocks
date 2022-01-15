import {expressionArgsInput, expressionControl, parseCodeBlockInputs} from '../block-patterns/code-patterns';
import {expressionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {formatCurlyBraces} from '../editor/format/formatHelpers';
import {statementBlock} from '../block-patterns/statement-patterns';

const block = statementBlock({
    title: '{ Statement }',
    info: 'Compile an arbitrary statement',
    useCases: [FOR_CUSTOM_LOGIC],
    category: expressionCategory,
    icon: expressionCategory.data.icon,
    // topLeft: 'inputs',
    // topRight: 'result',
    width: 14,
    inputs: [
        expressionArgsInput(),
    ],
    controls: [
        expressionControl(),
    ],
}, ({inputs, expression}) => {
    return `ignore do ${formatCurlyBraces(parseCodeBlockInputs(inputs, expression))};`;
});
export default block;
