const block = {
    title: 'Map Bool',
    topRight: 'result',
    inputs: [{
        key: 'condition',
        type: 'Bool',
    }, {
        key: 'true',
        type: 'Value',
    }, {
        key: 'false',
        type: 'Value',
    }],
    outputs: [{
        key: 'result',
        type: 'Value',
        compile({condition, trueCase, falseCase}) {
            if(condition === true) {
                return trueCase;
            }
            else if(condition === false) {
                return falseCase;
            }
            return `if (${condition}) {${trueCase}} else {${falseCase}}`;
        },
    }],
};
export default block;
