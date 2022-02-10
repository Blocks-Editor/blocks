import {boolType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {FaExclamation} from 'react-icons/fa';
import {FOR_TESTING} from '../editor/useCases';
import {assertionCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Assert',
    info: 'If any of the specified conditions are false, terminate the program',
    category: assertionCategory,
    icon: FaExclamation,
    useCases: [FOR_TESTING],
    inputs: [{
        key: 'conditions',
        type: boolType,
        multi: true,
    }],
}, ({conditions}) => {
    return conditions
        .map(condition => `assert ${condition};`)
        .join('\n');
});
export default block;
