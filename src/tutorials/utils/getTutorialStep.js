export default function getTutorialStep(progress, variables) {
    const {tutorial, step, stepIndex} = progress;

    let i = step.checkpoint ? stepIndex : 0;
    while(i < tutorial.steps.length) {
        const step = tutorial.steps[i];
        if(!step.isComplete?.(progress, variables)) {
            break;
        }
        i++;
    }
    return i === tutorial.steps.length ? null : tutorial.steps[i];
}
