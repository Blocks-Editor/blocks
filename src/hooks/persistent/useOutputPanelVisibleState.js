import useLocalStorage from '../utils/useLocalStorage';

export default function useOutputPanelVisibleState() {
    return useLocalStorage('blocks.outputPanelVisible', false);
}
