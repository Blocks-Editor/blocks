let replaceRegex = /{([0-9]+)}/g;

export function parseCodeBlockInputs(inputs, expression) {
    return (expression || '').replace(replaceRegex, (match, i) => {
        i = +i;
        return i >= 0 && i < inputs.length ? inputs[i] : match;
    });
}
