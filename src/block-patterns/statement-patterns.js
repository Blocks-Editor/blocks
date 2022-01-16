import {effectType, getSharedType, unitType} from '../block-types/types';
import {effectCategory} from '../block-categories/categories';
import {formatStatements} from '../editor/format/formatHelpers';

const defaultType = effectType.of(unitType);

export function statementBlock(block, compileFn, typeFn) {
    const beforeProp = {
        key: 'before',
        type: effectType,
        inferType(props, node, compiler) {
            // return after || defaultType;

            let block = compiler.getBlock(node);
            return getSharedType(...(typeFn ? [effectType.of(typeFn(props, node, compiler))] : []), ...block.inputs
                .filter(prop => effectType.isSubtype(prop.type))
                .map(prop => compiler.getInput(node, prop.key))) || defaultType;
        },
        toMotoko(props, node, compiler) {
            let result = compileFn(props, node, compiler);
            if(result === undefined) {
                return;
            }
            let {after} = props;
            return formatStatements(result, after);//`${result}${after ? ' ' + after : ''}`;
        },
    };
    // for(let [key, fn] of Object.entries(compileObject)) {
    //     beforeProp[key] = typeof fn === 'function' ? function(props, ...args) {
    //         let result = fn(props, ...args);
    //         if(result === undefined) {
    //             return;
    //         }
    //         let {after} = props;
    //         return `${result}${after ? ' ' + after : ''}`;
    //     } : fn;
    // }

    return {
        category: effectCategory,
        topLeft: 'before',
        topRight: 'after',
        ...block,
        inputs: [
            ...block.inputs || [], {
                key: 'after',
                type: effectType,
                optional: true,
                // multi: true,
            },
        ],
        outputs: [
            ...block.outputs || [],
            beforeProp,
        ],
    };
}

export function endStatementBlock(block, statementProp) {
    return {
        category: effectCategory,
        topLeft: 'statement',
        ...block,
        outputs: [...block.outputs || [], {
            key: 'statement',
            type: effectType,
            ...statementProp,
        }],
    };
}
