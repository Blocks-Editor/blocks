const inputTags = ['input', 'textarea'];

export default function isInputElement(element) {
    return !!element && inputTags.includes(element.nodeName.toLowerCase());
}