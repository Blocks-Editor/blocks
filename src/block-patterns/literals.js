export function literalValue(title, type, stringifier) {
    return {
        topRight: 'value',
        title: title,
        outputs: [{
            key: 'value',
            type,
            control: true,
            compile({value}) {
                return String(stringifier ? stringifier(value) : value);
            },
        }],
    };
}