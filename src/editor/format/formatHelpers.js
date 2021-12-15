export function formatParentheses(string) {
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