import {helloWorldTutorial} from './definitions/helloWorldTutorial';

export const TUTORIALS = [
    helloWorldTutorial,
];

export function getTutorialStep(tutorial, state) {
    const previousStepIndex = state.stepIndex;
    let i = tutorial.steps[state.stepIndex || 0]?.checkpoint ? previousStepIndex : 0;
    while(i < tutorial.steps.length) {
        const step = tutorial.steps[i];
        if(step.condition && !step.condition(state)) {

        }
        i++;
    }
}

