import {boolType, memberType} from '../block-types/types';
import SelectControlHandle from '../components/rete/controls/SelectControlHandle';


export function memberBlock(block, memberProp) {

    return {
        topLeft: 'member',
        ...block,
        outputs: [
            {
                key: 'member',
                type: memberType,
                ...memberProp,
            },
            ...block.outputs || [],
        ],
        controls: [
            {
                key: 'visibility',
                config: {
                    controlType: SelectControlHandle,
                    controlProps: {
                        options: [undefined, 'public', 'private'],
                        findLabel: (option) => option ? option.charAt(0).toUpperCase() + option.substring(1) : '--',
                    },
                },
                optional: true,
            },
            {
                key: 'stable',
                type: boolType,
            },
            ...block.controls || [],
        ],
    };
}