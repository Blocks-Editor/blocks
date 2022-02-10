import {referenceType, textType} from '../block-types/types';
import {FaItalic} from 'react-icons/fa';
import {defaultImportNameFromPath, importRef} from '../compilers/MotokoCompiler';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    title: 'Import',
    info: 'Reference an externally defined module',
    category: referenceCategory,
    useCases: [FOR_CUSTOM_LOGIC],
    icon: FaItalic,
    topRight: 'value',
    global: true,
    computeTitle(node, editor) {
        const name = defaultImportNameFromPath(editor.compilers.motoko.getInput(node, 'path'));
        if(name) {
            return `import ${name}`;
        }
    },
    outputs: [{
        key: 'value',
        type: referenceType,
        toMotoko({path}) {
            return importRef(path);
        },
    }],
    controls: [{
        key: 'path',
        type: textType,
        config: {
            validation: {
                minLength: 1,
            },
        },
    }],
};
export default block;
