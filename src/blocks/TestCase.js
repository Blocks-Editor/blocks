import {boolType, effectType, textType, unitType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {assertionCategory} from '../block-categories/categories';
import {FOR_TESTING} from '../editor/useCases';
import {formatStatementBlock} from '../editor/format/formatHelpers';
import {TEST_PRIORITY} from '../compilers/utils/compileGlobalMotoko';
import {FaCheckCircle} from 'react-icons/fa';

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
    }, {
        key: 'inactive',
        title: 'Skip for now',
        info: 'Temporarily deactivate this test case',
        type: boolType,
    }],
}, {
    toMotoko({inactive, description, body}, node, compiler) {
        if(inactive) {
            return;
        }

        const name = `test__${/*description ? pascalCase(description) : */node.id}`;

        const commentLine = description && `// Test: [${description}]\n`;

        return `let ${name} = do ${formatStatementBlock((commentLine || '') + (body || ''))}`;
    },
});
export default block;
