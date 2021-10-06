const Compiler = require('../editor/utils/Compiler').default;

exports.default = {
    category: 'Evaluation',
    inputs: [{
        key: 'input',
        type: 'Any',
    }],
    controls: [{
        key: 'display',
        type: 'Text',
    }],
    // async builder(node) {
    // },
    async worker(node, inputs, outputs, ...args) {
        console.log('!!!!');
        let compiler = new Compiler(this.editor);////

        let control = this.getControls(node).get('display');
        control.setValue(compiler.getInput(node, 'input'));
    },
};