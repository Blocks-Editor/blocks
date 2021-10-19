import {effectType, valueType} from '../block-types/types';

export function statementBlock(block, compile) {
    return {
        topLeft: 'before',
        topRight: 'after',
        ...block,
        inputs: [
            ...block.inputs || [], {
                key: 'after',
                type: effectType.of(valueType),
                // optional: true,
                multi: true,
            },
        ],
        outputs: [
            ...block.outputs || [], {
                key: 'before',
                type: effectType.of(valueType),
                compile(props) {
                    let {after} = props;
                    console.log(after);//////
                    return `${compile(props)}${after.map(s => ` ${s}`)/*after ? ' ' + after : ''*/}`;
                },
                inferType({after}) {
                    return after || effectType.of(valueType);
                },
            },
        ],
    };
}
