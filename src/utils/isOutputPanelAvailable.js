import isMenuHidden from './isMenuHidden';

export default function isOutputPanelAvailable() {
    return isMenuHidden(); // TODO: allow toggling "Compile" button separately from editor menu
}
