import {anyReversedType, anyType} from '../block-types/types';
import OutputControlHandle from '../components/rete/controls/OutputControlHandle';
import {compilerCategory} from '../block-categories/categories';
import {resolveImportRefs} from '../compilers/MotokoCompiler';
import prettyPrintMotoko from '../editor/format/prettyPrintMotoko';

export function compileBlock(compilerKey, block, displayFn) {
    function queryFor(inputKey) {
        return (control, node, editor) => {
            let value = editor.compilers[compilerKey].getInput(node, inputKey);
            let string = displayFn ? displayFn(value) : value;
            const [prefixes, code] = resolveImportRefs(string);
            return prettyPrintMotoko([...prefixes, code].join(' '));
        };
    }

    return {
        category: compilerCategory,
        icon: compilerCategory.data.icon,
        topLeft: 'input',
        topRight: 'reversed',
        width: 8,
        ...block,
        inputs: [{
            key: 'input',
            title: 'Input',
            type: anyType,
            optional: true,
        }, {
            key: 'reversed',
            title: 'Input',
            type: anyReversedType,
            optional: true,
        }],
        controls: [{
            key: 'reversedDisplay',
            title: 'Display',
            config: {
                controlType: OutputControlHandle,
                controlProps: {
                    query: queryFor('reversed'),
                },
            },
        }, {
            key: 'display',
            config: {
                controlType: OutputControlHandle,
                controlProps: {
                    query: queryFor('input'),
                },
            },
        }],
    };
}
