// Regex-based parser for Motoko (short-term solution for reverse code generation)

const indentCount = 4;
const indentString = ' '.repeat(indentCount);

export default function parseMotoko(input) {
    const lines = (input || '')
        .replace(/\t/g, indentString)
        .replace(/\r/g, '')
        .replace(/;\n/g, '\n') // Remove semicolons at end of lines
        .split('\n')
        .map((line, i) => {
            let indent = 0;
            while(line.startsWith(indentString)) {
                indent++;
                line = line.substring(indentCount);
            }
            return [indent, line.trim(), i];
        })
        .filter(([, line]) => !!line.trim());

    const result = {
        imports: [],
        params: [],
        types: [],
        states: [],
        functions: [],
    };
    parse(lines, result);
    return result;
}

function parse(lines, result) {
    for(let i = 0; i < lines.length; i++) {
        const [indent, line] = lines[i];
        if(line.startsWith('//')) {
            continue;
        }
        if(line.startsWith('import')) {
            const parts = line.split(' ');
            result.imports.push({
                name: parts[parts.length - 2],
                path: parts[parts.length - 1].slice(1, -1),
            });
            continue;
        }

        const subLines = [];
        for(let j = i + 1; j < lines.length; j++) {
            const [subIndent, subLine] = lines[j];
            if(subIndent > indent) {
                subLines.push([subIndent - 1, subLine]);
            }
            else {
                i = j - 1;
                break;
            }
        }

        if(line.includes('actor class')) {
            parseActorClass(line, subLines, result);
        }

        if(line.includes('type ')) {
            parseType(line, subLines, result);
        }

        if(line.includes('var ') || line.includes('let ')) {
            parseState(line, subLines, result);
        }

        if(line.includes('func ')) {
            parseFunction(line, subLines, result);
        }
    }
}

function parseActorClass(line, subLines, result) {

    const paramRegex = /([a-zA-Z_][a-zA-Z0-9_]*) *: *([^,)]+)/g;
    let paramResult;
    while((paramResult = paramRegex.exec(line)) !== null) {
        const [, name, type] = paramResult;
        // console.log([match,id,value]);
        result.params.push({
            name,
            type: type.trim(),
        });
    }

    parse(subLines, result);
}

function parseType(line, lines, result) {
    if(lines.length) {
        throw new Error(`Unable to parse multi-line type definition: ${line}`);
    }
    const typeResult = /type +([a-zA-Z_][a-zA-Z0-9_]*) =(.+)/.exec(line);
    if(!typeResult) {
        throw new Error(`Unable to parse state definition: ${line}`);
    }
    const [, name, type] = typeResult;

    result.types.push({
        name,
        type: type?.trim(),
        visibility: getVisibility(line),
    });
}

function parseState(line, lines, result) {
    if(lines.length) {
        throw new Error(`Unable to parse multi-line state definition: ${line}`);
    }
    const stateResult = /(let|var) +([a-zA-Z_][a-zA-Z0-9_]*) +(:[^=]*)?=(.+)/.exec(line);
    if(!stateResult) {
        throw new Error(`Unable to parse state definition: ${line}`);
    }
    const [, kind, name, type, initialValue] = stateResult;

    const parts = line.split(' ').map(s => s.trim()).filter(s => s);
    result.states.push({
        name,
        type: type?.trim(),
        initialValue: initialValue.trim(),
        visibility: getVisibility(line),
        stable: parts.includes('stable'),
        readonly: kind === 'let',
    });
}

function parseFunction(line, lines, result) {
    if(!lines.length) {
        throw new Error(`Unable to parse single-line function definition: ${line}`);
    }

    const nameResult = /func +([a-zA-Z_][a-zA-Z0-9_]*)/.exec(line);
    if(!nameResult) {
        throw new Error(`Unable to parse function definition: ${line}`);
    }
    const [, name] = nameResult;
    const typeResult = /: *([^){=]+) {$/.exec(line);
    const returnType = typeResult ? typeResult[1].trim() : 'Unit';

    const params = [];
    const paramRegex = /([a-zA-Z_][a-zA-Z0-9_]*) *: *([^,)]+)/g;
    let paramResult;
    while((paramResult = paramRegex.exec(line)) !== null) {
        const [, name, type] = paramResult;
        // console.log([match,id,value]);
        params.push({
            name,
            type: type.trim(),
        });
    }

    const parts = line.split(' ').map(s => s.trim()).filter(s => s);
    result.functions.push({
        name,
        params,
        returnType: returnType,
        visibility: getVisibility(line),
        shared: parts.includes('shared'),
        query: parts.includes('query'),
        body: lines.map(([indent, line]) => `${indentString.repeat(indent)}${line}`).join('\n'),
    });
}

function getVisibility(line) {
    return line.includes('public ') ? 'public' : line.includes('private ') ? 'private' : 'system';
}