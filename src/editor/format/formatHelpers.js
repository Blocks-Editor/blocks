function prepare(string) {
    return string === '' || string === null || string === undefined ? '' : string;
}

export function formatParentheses(string) {
    string = prepare(string);
    // Remove trivial double parentheses
    if(string.startsWith('(') && string.endsWith(')')) {
        const s = string.substring(1, string.length - 1);
        if(!s.includes('(') && !s.includes(')')) {
            string = s;
        }
    }
    return `(${string})`;
}

export function formatCurlyBraces(string) {
    string = prepare(string);
    return `{\n${string}\n}`;
}

export function formatStatementBlock(string) {
    string = prepare(string);
    return `${formatCurlyBraces(string)};`;
}

export function formatMembers(members) {
    if(!members) {
        return '';
    }
    return `${members.join('\n\n')}`;
}

export function formatStatements(statement, after) {
    if(!statement) {
        return after;
    }
    return after ? `${statement}\n${after}` : statement;
}