import useObservableState from '../utils/useObservableState';
import {EDITOR_MENU_STORE} from '../../observables/editorMenuStore';

export default function useEditorMenuState() {
    return useObservableState(EDITOR_MENU_STORE);
}
