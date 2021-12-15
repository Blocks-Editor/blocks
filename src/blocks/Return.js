import {effectType, unitType, valueType} from '../block-types/types';
import {endStatementBlock} from '../block-patterns/statement-patterns';
import {functionCategory} from '../block-categories/categories';
import {FaCaretLeft} from 'react-icons/fa';
import {FOR_BUILDING_API} from '../editor/useCases';

const block = endStatementBlock({
    info: 'End a function\'s execution path',
    useCases: [FOR_BUILDING_API],
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