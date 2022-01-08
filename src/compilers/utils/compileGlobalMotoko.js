import {memberType} from '../../block-types/types';
import {resolveImportRefs} from '../MotokoCompiler';
import prettyPrintMotoko from '../../editor/format/prettyPrintMotoko';
import {formatParentheses} from '../../editor/format/formatHelpers';
import {pascalCase} from 'change-case';
import {compileGlobalParameter} from '../../blocks/MainParameter';

const defaultActorName = 'Main';

export function mainSharedRef(editor) {
    return `${defaultActorName}__install`;
}

export function mainInstanceRef(editor) {
    return `${defaultActorName}__this`;
}

const installerBlockName = 'MainInstaller';
const mainParameterBlockName = 'MainParameter';

export default function compileGlobalMotoko(editor) {

    const actorName = pascalCase(editor.projectName) || defaultActorName;

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

    const installerNodes = editor.nodes.filter(node => node.name === installerBlockName);
    const paramNodes = editor.nodes.filter(node => node.name === mainParameterBlockName);

    const installerPart = installerNodes.length && `shared${formatParentheses(mainSharedRef(editor))}`;

    const thisPart = '';//`= ${mainInstanceRef(editor)}`
    const classPart = (thisPart || paramNodes.length) && `${formatParentheses(paramNodes.map(node => {
        return compileGlobalParameter(node, editor.compilers.motoko);
    }).join(', '))}`;

    const actorPart = `${installerPart ? `${installerPart} ` : ''}actor ${classPart ? `class ${actorName}${classPart}` : actorName}${thisPart ? ` ${thisPart}` : ''}`;

    const [prefixes, actorCode] = resolveImportRefs(`${actorPart} {${memberNodes.map(node => {
        const result = editor.compilers.motoko.getOutput(node, 'member');
        return result ? `\n  ${result}` : '';
    }).join('\n')}\n}`);

    // console.log(prettyPrintMotoko(`${prefixes.length ? prefixes.join('\n') + '\n\n' : ''}${actorCode}`))///
    // throw new Error()

    return prettyPrintMotoko(`${prefixes.length ? prefixes.join('\n') + '\n\n' : ''}${actorCode}`);
}
