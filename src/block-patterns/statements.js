export function statement(block, compile) {
    return {
        ...block,
        inputs: [
            ...block.inputs || [], {
                key: 'after',
                type: 'Effect',
                optional: true,
            },
        ],
        outputs: [
            ...block.outputs || [], {
                key: 'before',
                type: 'Effect',
                compile(props) {
                    let {after} = props;
                    return `${compile(props)}${after ? ' ' + after : ''}`;
                },
            },
        ],
    };
}
