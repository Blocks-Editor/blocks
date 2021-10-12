export function statement(block, compile) {
    return {
        topLeft: 'before',
        topRight: 'after',
        ...block,
        inputs: [
            ...block.inputs || [], {
                key: 'after',
                type: 'Effect',
                optional: true,
                // multi: true,
            },
        ],
        outputs: [
            ...block.outputs || [], {
                key: 'before',
                type: 'Effect',
                compile(props) {
                    let {after} = props;
                    return `${compile(props)}${after ? ' ' + after : ''}`;
                    // return `${compile(props)}${after.map(effect => ' ' + effect)}`;
                },
            },
        ],
    };
}
