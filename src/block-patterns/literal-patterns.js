export function literalBlock(title, type, stringifier) {
    return {
        topRight: 'value',
        title: title,
        outputs: [{
            key: 'value',
            type,
            control: true,
            compile({value}) {
                if(value === undefined) {
                    return;
                }
                return String(stringifier ? stringifier(value) : value);
            },
        }],
    };
}