import {memberType} from '../block-types/types';
import {resolveImportRefs} from '../compilers/MotokoCompiler';

export default function compileGlobalMotoko(editor) {

    const memberNodes = editor.nodes
        .filter(n => {
            const type = /* reversed */ n.inputs.get('member')?.socket.findType?.();
            return type && memberType.isSubtype(type);
        })
        .sort((a, b) => a.position[1] - b.position[1]);

    const [prefixes, actorCode] = resolveImportRefs(`actor {${memberNodes.map(n => {
        const result = editor.compilers.motoko.getOutput(n, 'member');
        return result ? `\n  ${result}` : '';
    }).join('\n')}\n}`);

    return `${prefixes.join('\n')}\n\n${actorCode}`;
}