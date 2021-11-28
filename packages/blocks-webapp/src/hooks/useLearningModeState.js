import useEditorSettings from './useEditorSettings';

export default function useLearningModeState() {
    const [settings, patchSettings] = useEditorSettings();

    return [settings.learningMode, (learningMode) => patchSettings({learningMode})];
}
