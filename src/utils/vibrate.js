export default function vibrate(duration) {
    try {
        window.navigator?.vibrate(duration);
    }
    catch(err) {
        console.error(err);
    }
}