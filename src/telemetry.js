import {logEvent} from 'firebase/analytics';
import {analytics} from './setupFirebase';
import {EDITOR_STATE_STORE} from './observables/editorStateStore';
import {EDITOR_VERSION} from './editor/createEditor';
import {TUTORIAL_PROGRESS_STORE} from './hooks/persistent/useTutorialProgressState';
import isEmbeddedMode from './utils/isEmbeddedMode';
import {TUTORIAL_STEP_STORE} from './observables/tutorialStepStore';
import {TELEMETRY_STORE} from './hooks/persistent/useTelemetryState';
import {THEME_STORE} from './hooks/persistent/useThemeState';

// Update GDPR opt-in/out
analytics.app.automaticDataCollectionEnabled = TELEMETRY_STORE.get();
TELEMETRY_STORE.subscribe(telemetry => {
    logEvent(analytics, telemetry ? 'telemetry_enable' : 'telemetry_disable');
    analytics.app.automaticDataCollectionEnabled = !!telemetry;
});

/**
 * Optionally send anonymized usage data to help us improve the Blocks Editor (it's genuinely super helpful).
 */
export function logTelemetry(id, options) {
    const tutorial = TUTORIAL_PROGRESS_STORE.get()?.tutorial;

    try {
        if(TELEMETRY_STORE.get()) {
            logEvent(analytics, id, {
                theme: THEME_STORE.get(),
                editor_version: EDITOR_VERSION,
                editor_mode: isEmbeddedMode() ? 'embedded' : undefined,
                project: EDITOR_STATE_STORE.get()?.name,
                tutorial,
                tutorial_step: TUTORIAL_STEP_STORE.get()?.title,
                ...options || {},
            });
        }
    }
    catch(err) {
        console.warn('Telemetry error');
        console.warn(err);
    }
}