import {memberType} from '../block-types/types';

export default function compileGlobalMotoko(editor) {

    const memberNodes = editor.nodes
        .filter(n => {
            const type = /* reversed */ n.inputs.get('member')?.socket.findType?.();
            return type && memberType.isSubtype(type);
        })
        .sort((a, b) => a.position[1] - b.position[1]);

    return `actor {${memberNodes.map(n => {
        const result = editor.compilers.motoko.getOutput(n, 'member');
        return result ? `\n  ${result}` : '';
    }).join('\n')}\n}`;
}