const inputTags = ['input', 'textarea'];
const inputClasses = ['btn'];

export default function isInputElement(element) {
    if(!element) {
        return false;
    }

    if(inputTags.includes(element.nodeName.toLowerCase())) {
        return true;
    }

    while(element) {
        for(const cls of inputClasses) {
            if(element.classList.contains(cls)) {
                return true;
            }
        }
        element = element.parentElement;
    }

    return false;
}