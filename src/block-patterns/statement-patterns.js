import {effectType, unitType} from '../block-types/types';

let defaultType = effectType.of(unitType);

export function statementBlock(block, compileObject) {
    let beforeProp = {
        key: 'before',
        type: effectType,
        inferType({after}) {
            return after || defaultType;
        },
    };
    for(let [key, fn] of Object.entries(compileObject)) {
        beforeProp[key] = function(props, ...args) {
            let result = fn(props, ...args);
            if(result === undefined) {
                return;
            }
            let {after} = props;
            return `${result}${after ? ' ' + after : ''}`;
        };
    }

    return {
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
