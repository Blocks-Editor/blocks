import {toast} from 'react-toastify';
import useFamiliarityState from '../hooks/persistent/useFamiliarityState';
import useTutorialProgressState from '../hooks/persistent/useTutorialProgressState';
import {helloWorldTutorial} from '../tutorials/definitions/helloWorldTutorial';

let prompted = false;

export default function GlobalTutorial() {

    const [familiarity, setFamiliarity] = useFamiliarityState();
    const [progress, setProgress] = useTutorialProgressState();

    if(!familiarity && !prompted && !progress) {
        prompted = true;
        toast('New to Blocks? Click here for a quick tutorial.', {
            type: 'info',
            autoClose: false,
            onClick() {
                setFamiliarity('learning');
                setProgress({
                    tutorial: helloWorldTutorial,
                });
            },
            onClose() {
                setFamiliarity('familiar');
            },
        });
    }

    return null;
}