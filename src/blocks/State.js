import {boolType, effectType, identifierType, unitType, valueType} from '../block-types/types';
import {getUserDefinedName, memberBlock} from '../block-patterns/member-patterns';
import {stateCategory} from '../block-categories/categories';
import {FaAngleDoubleRight, FaAngleRight} from 'react-icons/fa';
import {FOR_BUILDING_API, FOR_STORING_DATA} from '../editor/useCases';
import {formatStatement} from '../editor/format/formatHelpers';
import {STATE_PRIORITY} from '../compilers/utils/compileGlobalMotoko';

export const stateReadIcon = FaAngleRight;
export const stateWriteIcon = FaAngleDoubleRight;

const block = memberBlock({
    info: 'A persistent smart contract variable',
    useCases: [FOR_BUILDING_API, FOR_STORING_DATA],
    // topRight: 'value',
    topRight: 'setup',
    category: stateCategory,
    global: true,
    memberPriority: STATE_PRIORITY,
    computeTitle(node, editor) {
        let name = getUserDefinedName(node, editor);
        let type = editor.compilers.type.getInput(node, 'initialValue') || unitType;
        return name && `${name} : ${editor.compilers.motoko.getTypeString(type)}`;
    },
    shortcuts: [{
        block: 'StateRead',
        nodeKey: 'stateNode',
    }, {
        block: 'StateUpdate',
        nodeKey: 'stateNode',
    }],
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'initialValue',
        type: valueType,
        optional: true,
        request: true,
    }, {
        key: 'setup',
        type: effectType.of(unitType),
        optional: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        toMotoko({name}) {
            return name;
        },
        inferType({initialValue}) {
            return initialValue;
        },
    }],
    controls: [{
        key: 'stable',
        info: 'Preserve the state over canister upgrades: see the Motoko docs to learn more',
        type: boolType,
        advanced: true,
    }, {
        key: 'readonly',
        info: 'Readonly states cannot be reassigned, but value mutations are still possible',
        type: boolType,
        advanced: true,
    }],
}, {
    toMotoko({stable, readonly, name, initialValue, setup}, node, compiler) {
        let modifiers = [!!stable && 'stable'].filter(m => m).join(' ');
        let type = compiler.editor.compilers.type.getInput(node, 'initialValue');

        initialValue = initialValue || '()';

        let statement = `${modifiers && modifiers + ' '}${readonly ? 'let' : 'var'} ${name}${type ? ` : ${compiler.getTypeString(type)}` : ''} = ${initialValue};`;
        if(setup) {
            statement = formatStatement(statement, setup);
        }
        return statement;
    },
});
export default block;
