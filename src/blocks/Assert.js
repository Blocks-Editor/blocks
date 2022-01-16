import {boolType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {FaExclamation} from 'react-icons/fa';

const block = statementBlock({
    title: 'Assert',
    // category: debugCategory,
    icon: FaExclamation,
    inputs: [{
        key: 'condition',
        type: boolType,
    }],
}, ({condition}) => {
    return `assert ${condition};`;
});
export default block;
