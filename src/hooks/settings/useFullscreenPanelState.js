import useLocalStorage from '../utils/useLocalStorage';

export default function useFullscreenPanelState() {
    return useLocalStorage('blocks.fullscreenPanel', false);
}
