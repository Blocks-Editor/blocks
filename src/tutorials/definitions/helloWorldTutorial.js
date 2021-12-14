import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';
import {css} from 'styled-components';
import {getTutorialNode} from '../utils/getTutorialNode';
import {
    highlightContextMenuComponent,
    highlightNode,
    highlightNodeShortcut, highlightNodeSocket,
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
    title: 'Hello, World!',
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
                return 'Right-click somewhere on the page.';
            }
            if(contextMenu.node) {
                return 'Make sure to right-click on empty space.';
            }
            return <>Select the <code>Function</code> block.</>;
        },
    }, {
        title: 'Name the function',
        // info: 'Type something into the "Name" field.',
        style: css`
            ${highlightNode(functionNodeId, 'name')}
        `,
        render() {
            return (
                <>
                    <div>Type something into the <code>Name</code> field.</div>
                    <hr/>
                    <small>For example: <code>hello</code></small>
                </>
            );
        },
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            return node.data.name;
        },
    }, {
        ...createNodeStep('Return', returnNodeId),
        title: 'Add a Return statement',
        info: 'Click and drag the outlined box.',
        style: css`
            ${highlightNodeShortcut(functionNodeId, 'Return')}
            ${highlightNode(returnNodeId) /* Highlight return node if already exists */}
        `,
        render() {
            return <small>This is a shortcut for adding a <code>Return</code> statement.</small>;
        },
    }, {
        title: 'Connect the Return statement',
        info: 'Connect the two indicated sockets.',
        style: css`
            ${highlightNodeSocket(functionNodeId, 'body')}
            ${highlightNodeSocket(returnNodeId, 'statement')}
        `,
        isComplete(progress) {
            const node = getFunctionNode(progress.editor);
            const connections = node.outputs.get('body').connections;
            if(connections.some(conn => conn.input.node.id === returnNodeId)) {
                return true;
            }
            // Clear connections (TODO: move to side effect function)
            connections.forEach(conn => progress.editor.removeConnection(conn));
            return false;
        },
    }, {
        ...createNodeStep('LiteralText', textNodeId),
        title: 'Return a text value',
        style: css`
            ${highlightContextMenuComponent('LiteralText')}
            ${highlightNodeSocket(returnNodeId, 'value')}
            ${highlightNode(textNodeId) /* Highlight text node if already exists */}
        `,
        render(progress, {contextMenu}) {
            if(!contextMenu) {
                return <>Click and drag from the <code>Value</code> socket.</>;
            }
            if(!contextMenu.context) {
                return <>Make sure to drag from the <code>Value</code> socket on the <code>Return</code> block.</>;
            }
            return <>Type <code>text</code> into the search bar and click on the outlined result.</>;
        },
    }, {
        title: 'Connect the Text value',
        info: 'Connect the two indicated sockets.',
        style: css`
            ${highlightNodeSocket(returnNodeId, 'value')}
            ${highlightNodeSocket(textNodeId, 'value')}
        `,
        isComplete(progress) {
            const node = getReturnNode(progress.editor);
            const connections = node.inputs.get('value').connections;
            if(connections.some(conn => conn.output.node.id === textNodeId)) {
                return true;
            }
            // Clear connections (TODO: move to side effect function)
            connections.forEach(conn => progress.editor.removeConnection(conn));
            return false;
        },
    }, {
        title: 'Define the text content',
        // info: 'Write something in the "Value" text box.',
        style: css`
            ${highlightNode(textNodeId, 'value')}
        `,
        render() {
            return (
                <>
                    <div>Type something into the <code>Value</code> field.</div>
                    <hr/>
                    <small>For example: <code>Hello world!</code></small>
                </>
            );
        },
        isComplete(progress) {
            const node = getTextNode(progress.editor);
            return node.data.value;
        },
    }, {
        title: 'View the smart contract',
        info: 'Click the "Compile" button at the bottom-right of the page.',
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
                <small>
                    Your function is named <code>{functionNode.data.name}</code>{' '}
                    with a return value of <code>"{textNode.data.value}"</code>.
                </small>
            );
        },
        isComplete(progress, {outputPanel}) {
            return outputPanel;
        },
    }],
};