export default function prettyPrintMotoko(text, indent = '\t') {
    if(!text.trim()) {
        return '';
    }

    let depth = 0;

    const lines = text.split('\n')
        .map(s => s.trim())
        // .flatMap(s => {
        //     s = replaceSyntax(s, '{ ', '{\n');
        //     s = replaceSyntax(s, ' }', '\n}');
        //     s = replaceSyntax(s, '; ', ';\n');
        //     return text.split('\n');
        // })
        .map(s => {
            s = s.trim();
            if(s.startsWith('}') && depth > 0) {
                depth--;
            }
            s = indent.repeat(depth) + s;
            if(s.endsWith('{')) {
                depth++;
            }
            return s;
        });

    return lines.join('\n');
}