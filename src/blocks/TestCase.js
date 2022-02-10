import {effectType, textType, unitType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {assertionCategory} from '../block-categories/categories';
import {FOR_TESTING} from '../editor/useCases';
import {formatStatementBlock} from '../editor/format/formatHelpers';
import {TEST_PRIORITY} from '../compilers/utils/compileGlobalMotoko';
import {FaCheckCircle} from 'react-icons/fa';
import {pascalCase} from 'change-case';

const block = memberBlock({
    info: 'Verify that your smart contract works as expected',
    useCases: [FOR_TESTING],
    category: assertionCategory,
    topRight: 'body',
    global: true,
    memberPriority: TEST_PRIORITY,
    icon: FaCheckCircle,
    // computeTitle(node, editor) {
    // },
    shortcuts: [{
        block: 'Assert',
        connections: [{
            fromOutput: true,
            from: 'body',
            to: 'before',
        }],
    }],
    inputs: [{
        key: 'body',
        type: effectType.of(unitType),
        optional: true,
        request: true,
    }],
    controls: [{
        key: 'description',
        info: 'A short description of the expected behavior',
        type: textType,
    }],
}, {
    toMotoko({description, body}, node, compiler) {

        const name = `test__${description ? pascalCase(description) : node.id}`;

        return `let ${name} = do ${formatStatementBlock(body || '')}`;
    },
});
export default block;
