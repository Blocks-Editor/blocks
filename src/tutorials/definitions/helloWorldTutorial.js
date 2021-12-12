import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';

const functionNodeId = 'helloWorldFunction';

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello, world!',
    info: 'Create a simple Blocks smart contract',
    setupVariables(progress) {
        return {
            contextMenu: CONTEXT_MENU_STORE,
        };
    },
    steps: [{
        ...createNodeStep('Function', functionNodeId),
        title: 'Create a function',
        render(progress, {contextMenu}) {
            if(contextMenu) {
                return 'Select the "Function" block.';
            }
            return 'Right-click to open the context menu.';
        },
    }, {
        title: 'Good job!',
        info: '',
    }],
};