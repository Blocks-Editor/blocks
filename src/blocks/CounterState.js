import {identifierType, natType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {stateCategory} from '../block-categories/categories';
import {FaListOl} from 'react-icons/fa';
import {FOR_ASSIGNING_ID, FOR_BUILDING_API, FOR_STORING_DATA} from '../editor/useCases';
import {formatCurlyBraces, formatParentheses, formatStatement} from '../editor/format/formatHelpers';
import {STATE_PRIORITY} from '../compilers/utils/compileGlobalMotoko';

const block = memberBlock({
    title: 'Counter',
    info: 'Dispense numbers in increasing order',
    useCases: [FOR_ASSIGNING_ID, FOR_BUILDING_API, FOR_STORING_DATA],
    topRight: 'value',
    category: stateCategory,
    icon: FaListOl,
    global: true,
    memberPriority: STATE_PRIORITY,
    inputs: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }],
    outputs: [{
        key: 'value',
        title: 'Current value',
        type: natType,
        toMotoko({name}) {
            return name;
        },
    }, {
        key: 'nextValue',
        type: natType,
        toMotoko({name}) {
            const parts = [
                `${name} += 1;`,
                `${name}`,
            ];
            return formatParentheses(['do', formatCurlyBraces(parts.reduce((a, b) => formatStatement(a, b)))]);
        },
    }],
}, {
    toMotoko({name}) {
        return `private stable var ${name} : Nat = 0;`;
    },
});
export default block;
