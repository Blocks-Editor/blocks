import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello World',
    info: 'Create a simple "Hello World" program',
    variables: {
        contextMenu: CONTEXT_MENU_STORE,
    },
    steps: [{
        title: 'Create a function',
        info: 'Right-click to open the context menu.',
        condition: ({contextMenu}) => contextMenu,
    }, {
        title: 'Create a function',
        info: 'Select the "Function" block.',
        condition: ({editor}) => false,
    }, {
        title: '',
        info: '',
    }],
};