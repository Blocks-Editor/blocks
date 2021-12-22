import {makeLocalStorageObservable} from '../utils/useLocalStorage';
import {useCallback, useMemo} from 'react';
import {TUTORIALS} from '../../tutorials/tutorials';
import useNodeEditor from '../useNodeEditor';
import getEmbedConfig from '../../utils/getEmbedConfig';
import useObservableState from '../utils/useObservableState';
import {logTelemetry} from '../../telemetry';

const defaultTutorial = getEmbedConfig('tutorial');
const defaultState = defaultTutorial ? {tutorial: defaultTutorial} : null;

export const TUTORIAL_PROGRESS_STORE = makeLocalStorageObservable('blocks.tutorialProgress', defaultState);

export default function useTutorialProgressState() {
    const [state, setState] = useObservableState(TUTORIAL_PROGRESS_STORE);

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

    const setProgress = useCallback(progress => {
        if(!state && progress) {
            setTimeout(() => logTelemetry('tutorial_start'));
        }
        else if(state && !progress) {
            logTelemetry('tutorial_end');
        }

        setState(progress ? {
            ...progress,
            editor: undefined,
            tutorial: progress.tutorial?.id,
            // step: undefined,
        } : null);
    }, [state, setState]);

    return [progress, setProgress];
}
