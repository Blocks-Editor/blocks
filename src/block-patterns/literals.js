export function literalValue(title, type, stringifier) {
    return {
        title: title,
        outputs: [{
            key: 'value',
            type,
            control: true,
            compile(node, compiler) {
                let value = compiler.getControl(node, 'value');
                return String(stringifier ? stringifier(value) : value);
            },
        }],
    };
}