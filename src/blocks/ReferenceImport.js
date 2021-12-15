import {referenceType, textType} from '../block-types/types';
import {FaItalic} from 'react-icons/fa';
import {importRef} from '../compilers/MotokoCompiler';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';

const block = {
    title: 'Import Reference',
    // category: defaultCategory,
    useCases: [FOR_CUSTOM_LOGIC],
    icon: FaItalic,
    topRight: 'value',
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
