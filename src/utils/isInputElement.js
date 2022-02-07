const inputTags = ['input', 'textarea'];
const inputClasses = ['btn'];

export default function isInputElement(element) {
    if(!element) {
        return false;
    }
    return inputTags.includes(element.nodeName.toLowerCase()) || inputClasses.some(cls => element.classList.contains(cls));
}