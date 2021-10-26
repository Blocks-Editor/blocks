import {effectType, unitType, valueType} from '../block-types/types';
import {endStatementBlock} from '../block-patterns/statement-patterns';
import {functionCategory} from '../block-categories/categories';
import {FaCaretLeft} from 'react-icons/all';

const block = endStatementBlock({
    category: functionCategory,
    icon: FaCaretLeft,
    inputs: [{
        key: 'value',
        type: valueType,
        optional: true,
    }],
    // controls: [{
    //     key: 'functionNode',
    //     config: {
    //         controlType: NodeControlHandle,
    //         controlProps: {
    //             component: 'Function',
    //         },
    //     },
    // }],
}, {
    inferType({value}) {
        return effectType.of(value || unitType);
    },
    toMotoko({value}) {
        return `return${value ? ' ' + value : ''};`;
    },
});
export default block;