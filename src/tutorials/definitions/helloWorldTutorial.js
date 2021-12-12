import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';
import {css} from 'styled-components';
import {getTutorialNode} from '../utils/getTutorialNode';
import {highlightNode} from '../utils/tutorialStyles';
import {KEY_UP_STORE} from '../../observables/keyUpStore';
import {CREATE_NODE_STORE} from '../../observables/createNodeStore';

const functionNodeId = 'helloWorldFunction';

const getFunctionNode = (editor) => getTutorialNode(editor, functionNodeId);

const style = css`

`;

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello, world!',
    info: 'Create a simple Blocks smart contract',
    style,
    setupVariables(progress) {
        return {
            contextMenu: CONTEXT_MENU_STORE,
            _createNode: CREATE_NODE_STORE, // Update tutorial on create node
            _keyUp: KEY_UP_STORE, // Update tutorial on key up
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
        title: 'Name the function',
        info: 'Type something into the "Name" field.',
        style: css`
            ${highlightNode(functionNodeId, 'name')}
        `,
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            // console.log(node.data.name);///
            return node.data.name;
        },
    }, {
        title: 'Good job!',
        info: '',
    }],
};