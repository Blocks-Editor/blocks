import {effectType, unitType} from '../block-types/types';
import {effectCategory} from '../block-categories/categories';

let defaultType = effectType.of(unitType);

export function statementBlock(block, compileFn) {
    let beforeProp = {
        key: 'before',
        type: effectType,
        inferType({after}) {
            console.log(after)//////
            return after || defaultType;
        },
        toMotoko(props, ...args) {
            let result = compileFn(props, ...args);
            if(result === undefined) {
                return;
            }
            let {after} = props;
            return `${result}${after ? ' ' + after : ''}`;
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
