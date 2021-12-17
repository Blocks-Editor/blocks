import useLocalStorage from '../utils/useLocalStorage';
import {useMemo} from 'react';
import {TUTORIALS} from '../../tutorials/tutorials';
import useNodeEditor from '../useNodeEditor';
import getEmbedConfig from '../../utils/getEmbedConfig';

export default function useTutorialProgressState() {
    const defaultTutorial = getEmbedConfig('tutorial');
    const defaultState = defaultTutorial ? {tutorial: defaultTutorial} : null;

    const [state, setState] = useLocalStorage('blocks.tutorialProgress', defaultState);

    const editor = useNodeEditor();

    const progress = useMemo(() => {
        if(!state) {
            return null;
        }
        const tutorial = TUTORIALS.find(t => t.id === state.tutorial);
        if(!tutorial) {
            return null;
        }
        // const stepIndex = Math.min(state.stepIndex || 0, tutorial.steps.length - 1);
        return Object.freeze({
            ...state,
            editor,
            tutorial,
            // stepIndex,
            // step: tutorial.steps[stepIndex],
        });
    }, [editor, state]);

    return [
        progress,
        progress => {
            setState(progress ? {
                ...progress,
                editor: undefined,
                tutorial: progress.tutorial?.id,
                // step: undefined,
            } : null);
        },
    ];
}
