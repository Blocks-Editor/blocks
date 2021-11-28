import makeObservable from '../utils/makeObservable';
import useObservableState from './useObservableState';

// TODO: eventually switch to global store such as Redux
const settingsStore = makeObservable({
    // Default settings
    learningMode: false,
});

export default function useEditorSettings() {
    const [settings, setSettings] = useObservableState(settingsStore);

    const patchSettings = (patch) => {
        return !!(patch && setSettings({...settings, ...patch}));
    };

    return [settings, patchSettings];
}
