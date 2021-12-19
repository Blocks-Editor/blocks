import {memberType} from '../../block-types/types';
import {resolveImportRefs} from '../MotokoCompiler';
import prettyPrintMotoko from '../../editor/format/prettyPrintMotoko';
import {formatParentheses} from '../../editor/format/formatHelpers';
import {pascalCase} from 'change-case';
import {compileGlobalParameter} from '../../blocks/MainParameter';

export function globalInstallRef(editor) {
    return 'install';
}

export function globalObjectRef(editor) {
    return 'this';
}

const defaultActorName = 'Main';

export default function compileGlobalMotoko(editor) {

    const memberNodes = editor.nodes
        .filter(node => {
            const io = node.inputs.get('member');
            if(!io || io.connections.length) {
                return false;
            }
            const type = /* reversed */ io.socket.findType?.();
            return type && memberType.isSubtype(type);
        })
        .sort((a, b) => a.position[1] - b.position[1]);

    const configNodes = editor.nodes
        .filter(node => node.name === 'GlobalParameter');

    const actorName = pascalCase(editor.projectName) || defaultActorName;

    const actorClassPart = /*configNodes.length && */`${formatParentheses(configNodes.map(node => {
        // return editor.compilers.motoko.getOutput(node, 'param');
        return compileGlobalParameter(node, editor.compilers.motoko);
    }).join(', '))} = ${globalObjectRef(editor)}`;

    const actorPart = `shared ${formatParentheses(globalInstallRef(editor))} actor ${actorClassPart ? `class ${actorName}${actorClassPart}` : actorName}`;

    const [prefixes, actorCode] = resolveImportRefs(`${actorPart} {${memberNodes.map(node => {
        const result = editor.compilers.motoko.getOutput(node, 'member');
        return result ? `\n  ${result}` : '';
    }).join('\n')}\n}`);

    return prettyPrintMotoko(`${prefixes.length ? prefixes.join('\n') + '\n\n' : ''}${actorCode}`);
}
