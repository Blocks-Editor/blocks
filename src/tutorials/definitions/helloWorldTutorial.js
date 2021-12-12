import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';
import {css} from 'styled-components';
import {getTutorialNode} from '../utils/getTutorialNode';
import {highlightNode} from '../utils/tutorialStyles';
import {EDITOR_STATE_STORE} from '../../observables/editorStateStore';

// Custom ID for the tutorial's function block
const functionNodeId = 'helloWorldFunction';

const getFunctionNode = (editor) => getTutorialNode(editor, functionNodeId);

// Global style when tutorial is active
const style = css`

`;

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello, world!',
    info: 'Create a simple Blocks smart contract',
    style,
    setupVariables(progress) {
        // Update tutorial on context menu and editor state changes
        return {
            contextMenu: CONTEXT_MENU_STORE,
            editorState: EDITOR_STATE_STORE,
        };
    },
    steps: [{
        ...createNodeStep('Function', functionNodeId),
        title: 'Create a function',
        render(progress, {contextMenu}) {
            if(contextMenu) {
                return 'Select the "Function" block.';
            }
            return 'Right-click somewhere in the editor to open the context menu.';
        },
    }, {
        title: 'Name the function',
        info: 'Type something into the "Name" field.',
        style: css`
            ${highlightNode(functionNodeId, 'name')}
        `,
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            return node?.data.name;
        },
    }],
};