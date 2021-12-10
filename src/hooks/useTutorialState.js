import useLocalStorage from '../utils/useLocalStorage';

// Is this the correct usage of capital case?
// Sincerely, Python Boy
const DEFAULT_TUTORIAL_STATE = {
    'isActive': false,
    'title': '',
    'activeStep': 0,
    'steps': [
        {
            'text': '',
            'referenceNodeID': 0
        }
    ]
}

export default function useTutorialState() {
    return useLocalStorage('blocks.tutorialState', DEFAULT_TUTORIAL_STATE);
}
