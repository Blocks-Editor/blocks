export function formatString(string) {
    if(Array.isArray(string)) {
        string = string.map(formatString).filter(s => s).join(' ');
    }
    return string === '' || string === null || string === undefined ? '' : string;
}

export function formatParentheses(string) {
    string = formatString(string);
    // Remove trivial double parentheses
    if(string.startsWith('(') && string.endsWith(')')) {
        const s = string.substring(1, string.length - 1);
        if(!s.includes('(') && !s.includes(')')) {
            string = s;
        }
    }
    return `(${string})`;
}

export function formatOptionalParentheses(string) {
    string = formatString(string);
    if(string.includes(' ')) {
        string = formatParentheses(string);
    }
    return string;
}

export function formatCurlyBraces(string) {
    string = formatString(string);
    return `{\n${string}\n}`;
}

export function formatStatementBlock(string) {
    string = formatString(string);
    return `${formatCurlyBraces(string)};`;
}

export function formatMembers(members) {
    if(!members) {
        return '';
    }
    return `${members.join('\n\n')}`;
}

export function formatStatement(statement, after) {
    statement = formatString(statement);
    if(!statement) {
        return after;
    }
    if(!statement.endsWith(';')) {
        statement = `${statement};`;
    }
    return after ? `${statement}\n${after}` : statement;
}
