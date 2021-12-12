import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';
import {css} from 'styled-components';
import {getTutorialNode} from '../utils/getTutorialNode';
import {
    highlightContextMenuComponent,
    highlightNode,
    highlightNodeShortcut,
    highlightStyle,
} from '../utils/tutorialStyles';
import {EDITOR_STATE_STORE} from '../../observables/editorStateStore';
import {OUTPUT_PANEL_STATE} from '../../hooks/persistent/useOutputPanelState';

// Custom ID for the tutorial blocks
const functionNodeId = 'helloFunction';
const returnNodeId = 'helloReturn';
const textNodeId = 'helloText';

// TODO: automatic lookup
const getFunctionNode = editor => getTutorialNode(editor, functionNodeId);
const getReturnNode = editor => getTutorialNode(editor, returnNodeId);
const getTextNode = editor => getTutorialNode(editor, textNodeId);

// Global style when tutorial is active
const style = css`

`;

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello, world!',
    info: 'Create a simple Blocks smart contract',
    style,
    setupVariables(progress) {
        // Update tutorial based on these observables
        return {
            contextMenu: CONTEXT_MENU_STORE,
            editorState: EDITOR_STATE_STORE,
            outputPanel: OUTPUT_PANEL_STATE,
        };
    },
    steps: [{
        ...createNodeStep('Function', functionNodeId),
        title: 'Create a function',
        style: css`
            ${highlightContextMenuComponent('Function')}
        `,
        render(progress, {contextMenu}) {
            if(!contextMenu) {
                return 'Right-click somewhere in the editor.';
            }
            if(contextMenu.node) {
                return 'Make sure to right-click on empty space.';
            }
            return 'Select the "Function" block.';
        },
    }, {
        title: 'Name the function',
        info: 'Type something into the "Name" field.',
        style: css`
            ${highlightNode(functionNodeId, 'name')}
        `,
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            return node.data.name;
        },
    }, {
        ...createNodeStep('Return', returnNodeId),
        title: 'Add a return statement',
        info: 'Click and drag the highlighted icon.',
        style: css`
            ${highlightNodeShortcut(functionNodeId, 'Return')}
        `,
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            const connections = node.outputs.get('body').connections;
            if(connections.find(conn => conn.input.node.id === returnNodeId)) {
                return true;
            }
            // Remove unexpected connections (we could alternatively ask the user to do this in a new step)
            connections.forEach(conn => progress.editor.removeConnection(conn));
            return false;
        },
    }, {
        ...createNodeStep('LiteralText', textNodeId),
        title: 'Return a text value',
        style: css`
            ${highlightNode(returnNodeId, 'value')}
            ${highlightContextMenuComponent('LiteralText')}
        `,
        render(progress, {contextMenu}) {
            if(!contextMenu) {
                return 'Click and drag from the "Value" socket.';
            }
            if(!contextMenu.context) {
                return 'Make sure to drag from the "Value" socket on the "Return" block.';
            }
            return 'Search for the "Text" block.';
        },
        isComplete(progress) {
            const node = getReturnNode(progress.editor);
            const connections = node.inputs.get('value').connections;
            if(connections.find(conn => conn.output.node.id === textNodeId)) {
                return true;
            }
            // Remove unexpected connections (we could alternatively ask the user to do this in a new step)
            connections.forEach(conn => progress.editor.removeConnection(conn));
            return false;
        },
    }, {
        title: 'Define the text content',
        info: 'Write something in the "Value" text box.',
        style: css`
            ${highlightNode(textNodeId, 'value')}
        `,
        isComplete(progress) {
            const node = getTextNode(progress.editor);
            return node.data.value;
        },
    }, {
        title: 'View the smart contract',
        info: 'Click the highlighted "Compile" button.',
        style: css`
            .compile-button {
                border: 1px solid white;
                ${highlightStyle}
            }
        `,
        render(progress) {
            const functionNode = getFunctionNode(progress.editor);
            const textNode = getTextNode(progress.editor);
            return (
                <div>
                    <small>
                        Your function is called "{functionNode.data.name}"
                        with a return value of "{textNode.data.value}".
                    </small>
                </div>
            );
        },
        isComplete(progress, {outputPanel}) {
            return outputPanel;
        },
    }],
};