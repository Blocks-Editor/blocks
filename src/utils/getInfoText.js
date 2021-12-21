export default function getInfoText(info) {
    if(info && !info.endsWith('.')) {
        info = `${info}.`;
    }
    return info;
}