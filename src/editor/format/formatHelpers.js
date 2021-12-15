export function formatParentheses(string) {
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
    return `{\n${string}\n}`;
}

export function formatStatementBlock(string) {
    return `${formatCurlyBraces(string)};`;
}

export function formatMembers(members) {
    return `${members.join('\n\n')}`;
}

export function formatStatements(before, after) {
    return after ? `${before}\n${after}` : before;
}