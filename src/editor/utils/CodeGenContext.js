export default class CodeGenContext {
    constructor(state, parent) {
        this.parent = parent || null;
        this.result = '';
        this.indent = 0;
        this.indentText = '    ';
        this.state = {};
    }

    write(text) {
        this.result += text.replace('\n', this.indentText.repeat(this.indent) + '\n');
    }


}