import {importStatement, resolveImportRefs} from '../MotokoCompiler';
import prettyPrintMotoko from '../../editor/format/prettyPrintMotoko';
import {formatParentheses} from '../../editor/format/formatHelpers';
import {pascalCase} from 'change-case';
import {compileGlobalParameter} from '../../blocks/MainParameter';
import {getBlock} from '../../editor/blocks';
import {memberType} from '../../block-types/types';

// Priority for ordering members
export const TYPE_PRIORITY = 1;
export const FUNCTION_PRIORITY = 2;
export const STATE_PRIORITY = 3;
export const CODE_PRIORITY = 4;
export const TEST_PRIORITY = 5;

// const packageBlockName = 'GithubPackage'; // external GitHub packages
const codeImportBlockName = 'CodeImport'; // import expressions
const referenceImportBlockName = 'ReferenceImport'; // import references
const installerBlockName = 'MainInstaller'; // installer details
const mainParameterBlockName = 'MainParameter'; // actor class parameters (config blocks)
const testCaseBlockName = 'TestCase'; // test cases

const defaultActorName = 'Main';

export function mainSharedRef(editor) {
    return 'main__install';
}

export function mainInstanceRef(editor) {
    return 'main__this';
}

// TODO refactor
export function hasTestCases(editor) {
    return editor.nodes.some(node => node.name === testCaseBlockName);
}

export default function compileGlobalMotoko(editor, options) {
    options = options || {};

    const actorName = pascalCase(editor.details.name) || defaultActorName;

    const memberNodes = editor.nodes
        .filter(node => {
            const io = node.inputs.get('member');
            if(!io || io.connections.length) {
                return false;
            }
            const type = /* reversed */ io.socket.findType?.();
            return type && memberType.isSubtype(type) && (options.test !== false /* tests by default */ || node.name !== testCaseBlockName);
        })
        .map(node => [node, getBlock(node.name)])
        .sort(([a, aBlock], [b, bBlock]) => ((aBlock.memberPriority || 0) - (bBlock.memberPriority || 0)) || (a.position[0] - b.position[0]) || (a.position[1] - b.position[1]) || 0)
        .map(([node]) => node);

    // const packageNodes = editor.nodes.filter(node => node.name === packageBlockName);
    const codeImportNodes = editor.nodes.filter(node => node.name === codeImportBlockName);
    const referenceImportNodes = editor.nodes.filter(node => node.name === referenceImportBlockName);
    const installerNodes = editor.nodes.filter(node => node.name === installerBlockName);
    const paramNodes = editor.nodes.filter(node => node.name === mainParameterBlockName);

    const installerPart = installerNodes.length && `shared${formatParentheses(mainSharedRef(editor))}`;

    const thisPart = '';//`= ${mainInstanceRef(editor)}`
    const classPart = (installerPart || thisPart || paramNodes.length) && `${formatParentheses(paramNodes.map(node => {
        return compileGlobalParameter(node, editor);
    }).join(', '))}`;

    const importPart = [
        ...codeImportNodes.map(node => editor.compilers.motoko.getOutput(node, 'result')?.trim() || ''),
        ...referenceImportNodes.map(node => importStatement(node.data.path)),
        // ...packageNodes.map(node => importStatement(getPackageImportPath(editor.compilers.motoko.getOutput(node, 'name')))),
    ].filter(s => s).join('\n');
    const actorPart = `actor ${classPart ? `class ${actorName}${classPart}` : actorName}${thisPart ? ` ${thisPart}` : ''}`;

    const [prefixes, actorCode] = resolveImportRefs(`${actorPart} {${memberNodes.map(node => {
        const result = editor.compilers.motoko.getOutput(node, 'member');
        return result ? `\n  ${result}` : '';
    }).join('\n')}\n}`, importPart);

    return prettyPrintMotoko(`${prefixes.length ? prefixes.join('\n') + '\n\n' : ''}${actorCode}`);
}
