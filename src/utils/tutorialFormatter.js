import {isMobile} from 'react-device-detect';

const Device = {
    DESKTOP: 0,
    MOBILE: 1
}

const replaceStrings = {
    '{right-click}': ['right click', 'long tap'],
    '{left-click}': ['left click', 'tap'],
    '{click-and-drag}': ['click and drag', 'drag']
}

// Replace all instances of the formatting tags with the correct strings.
function replace(input) {
    const device = isMobile ? Device.MOBILE : Device.DESKTOP;
    let outputStr = input;
    for (let [key, value] of Object.entries(replaceStrings)) {
        outputStr = outputStr.replace(key, value[device]);
    }
    return outputStr;
}

// Capitalize the text for human beings.
function capitalize(input) {
    const re = /(^|[.!?]\s+)([a-z])/g;
    input = input[0].toUpperCase() + input.slice(1);
    input = input.replace(re, (m, $1, $2) => $1 + $2.toUpperCase());
    return input;
}

export default function tutorialFormatter(input) {
    return capitalize(replace(input));
}