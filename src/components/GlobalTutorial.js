import {toast} from 'react-toastify';
import useFamiliarityState from '../hooks/settings/useFamiliarityState';

let prompted = false;

export default function GlobalTutorial() {

    const [familiarity, setFamiliarity] = useFamiliarityState();

    if(!familiarity && !prompted) {
        prompted = true;
        toast('New to Blocks? Click here for a quick tutorial.', {
            type: 'info',
            autoClose: false,
            onClick() {
                setFamiliarity('learning');
            },
            onClose() {
                setFamiliarity('familiar');
            },
        });
    }

    return null;
}