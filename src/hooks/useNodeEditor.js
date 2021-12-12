import useObservableState from './utils/useObservableState';
import {EDITOR_STORE} from '../observables/editorStore';

export default function useNodeEditor() {
    const [editor] = useObservableState(EDITOR_STORE);
    return editor;
}
