import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';
import {createNodeStep} from '../steps/createNodeStep';
import {css} from 'styled-components';
import {getTutorialNode} from '../utils/getTutorialNode';
import {
    highlightContextMenuComponent,
    highlightNode,
    highlightNodeShortcut,
    highlightNodeSocket,
} from '../utils/tutorialStyles';
import {EDITOR_STATE_STORE} from '../../observables/editorStateStore';
import {OUTPUT_PANEL_STATE} from '../../hooks/persistent/useOutputPanelState';
import {EDITOR_SELECTION_STORE} from '../../observables/editorSelectionStore';
import capitalize from '../../utils/capitalize';
import {TUTORIAL_CLICK_DRAG, TUTORIAL_CONTEXT_MENU_CLICK, TUTORIAL_CTRL} from '../utils/tutorialText';
import {isMobile} from 'react-device-detect';
import {SHORTCUT_BLOCK_FROM_KEY_MAP} from '../../editor/shortcutKeys';
import {getBlock} from '../../editor/blocks';
import {viewOutputStep} from '../steps/viewOutputStep';

// Custom tutorial block IDs
const stateNodeId = 'powerState';
const initialNodeId = 'powerInitialValue';
const functionNodeId = 'powerFunction';
const returnNodeId = 'powerReturn';
const returnValueNodeId = 'powerReturnValue';
const memberNodeId = 'powerMember';

// TODO: automatic lookup
const getStateNode = editor => getTutorialNode(editor, stateNodeId);
const getFunctionNode = editor => getTutorialNode(editor, functionNodeId);
const getReturnValueNode = editor => getTutorialNode(editor, returnValueNodeId);
const getMemberNode = editor => getTutorialNode(editor, memberNodeId);

// Global style when tutorial is active
const style = css`

`;

export const powerUserTutorial = {
    id: 'power-user',
    name: 'Power User',
    description: 'Learn how to use the Blocks Editor like a pro.',
    style,
    setupVariables(progress) {
        // Update tutorial based on these observables
        return {
            contextMenu: CONTEXT_MENU_STORE,
            editorState: EDITOR_STATE_STORE,
            editorSelection: EDITOR_SELECTION_STORE,
            outputPanel: OUTPUT_PANEL_STATE,
        };
    },
    steps: [{
        // title: 'Designed for computers',
        info: 'This tutorial is intended for devices with a mouse and keyboard.',
        isComplete() {
            return !isMobile;
        },
    }, {
        ...createNodeStep('State', stateNodeId),
        title: 'Create a state',
        style: css`
            ${highlightContextMenuComponent('State')}
        `,
        render(progress, {contextMenu}) {
            return <>
                Press <code>{SHORTCUT_BLOCK_FROM_KEY_MAP.get(getBlock('State'))}</code> to
                quickly add a new State block.
            </>;
        },
    }, {
        title: 'Name the state',
        // info: 'Type something into the "Name" field.',
        style: css`
            ${highlightNode(stateNodeId, 'name')}
        `,
        render() {
            return <>
                <div>Type something into the <code>Name</code> field.</div>
                <hr/>
                <small>For example: <code>storage</code></small>
            </>;
        },
        isComplete(progress) {
            const node = getStateNode(progress.editor);
            return node.data.name;
        },
    }, {
        ...createNodeStep('LiteralNat', initialNodeId),
        title: 'Define the initial value',
        style: css`
            ${highlightContextMenuComponent('LiteralNat', true)}
            ${highlightNodeSocket(stateNodeId, 'initialValue')}
            ${highlightNode(initialNodeId) /* Highlight initial value node if already exists */}
        `,
        render(progress, {contextMenu}) {
            if(!contextMenu) {
                return <>{capitalize(TUTORIAL_CLICK_DRAG)} from the <code>Initial value</code> socket.</>;
            }
            if(!contextMenu.context) {
                return <>Make sure to drag from the <code>Initial value</code> socket on
                    the <code>State</code> block.</>;
            }
            return <>Type <code>5</code> into the search bar and click on the outlined result.</>;
        },
    }, {
        ...createNodeStep('Function', functionNodeId),
        title: 'Create a function',
        style: css`
            ${highlightContextMenuComponent('Function')}
        `,
        render(progress, {contextMenu}) {
            return <>Press <code>{SHORTCUT_BLOCK_FROM_KEY_MAP.get(getBlock('Function'))}</code> to
                quickly add a new Function block.</>;
        },
    }, {
        ...createNodeStep('Return', returnNodeId),
        title: 'Add a Return statement',
        info: `${capitalize(TUTORIAL_CLICK_DRAG)} the outlined button.`,
        style: css`
            ${highlightNodeShortcut(functionNodeId, 'Return')}
            ${highlightContextMenuComponent('Return') /* Highlight context menu for adventurous users */}
            ${highlightNode(returnNodeId) /* Highlight return node if already exists */}
        `,
        // render() {
        //     return <small>This is a shortcut for adding a <code>Return</code> statement.</small>;
        // },
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
        ...createNodeStep('StateRead', returnValueNodeId),
        title: 'Return the state\'s value',
        style: css`
            ${highlightContextMenuComponent('StateRead', true)}
            ${highlightNodeSocket(returnNodeId, 'value')}
            ${highlightNode(returnValueNodeId, 'value') /* Highlight initial value node if already exists */}
        `,
        render(progress, {contextMenu}) {
            if(!contextMenu) {
                return <>{capitalize(TUTORIAL_CLICK_DRAG)} from the <code>Value</code> socket.</>;
            }
            if(!contextMenu.context) {
                return <>Make sure to drag from the <code>Value</code> socket on the <code>Return</code> block.</>;
            }
            const stateName = getStateNode(progress.editor)?.data.name || 'state';
            return <>
                Type <code>{stateName}</code> (the name of your State block)
                into the search bar and click on the outlined result.
            </>;
        },
    }, {
        title: 'Use the relevant state',
        style: css`
            ${highlightNode(returnValueNodeId, 'stateNode')}
        `,
        render(progress, {contextMenu}) {
            const stateName = getStateNode(progress.editor)?.data.name || 'state';
            return <>Select <code>{stateName}</code> in the drop-down menu.</>;
        },
        isComplete(progress) {
            const node = getReturnValueNode(progress.editor);
            return node.data.stateNode;
        },
    }, {
        ...createNodeStep('CodeMember', memberNodeId),
        title: 'Add a custom member block',
        style: css`
            ${highlightContextMenuComponent('CodeMember')}
        `,
        render() {
            const contextMenu = CONTEXT_MENU_STORE.get();
            if(!contextMenu) {
                return <>
                    Hold {TUTORIAL_CTRL} and {TUTORIAL_CONTEXT_MENU_CLICK} in the editor space.
                    <hr/>
                    <small>This makes it possible to search all available blocks.</small>
                </>;
            }
            else if(!contextMenu.context) {
                return <>Make sure to hold {TUTORIAL_CTRL} and {TUTORIAL_CONTEXT_MENU_CLICK}.</>;
            }
            return <>Type in <code>member</code> and select the <code>{'{'} Member {'}'}</code> block.</>;
        },
    }, {
        title: 'Add some custom code',
        style: css`
            ${highlightNode(memberNodeId, 'expression')}
        `,
        render() {
            return <>
                Type something in the custom Member block.
                <hr/>
                <small>Example: <code>let custom = 0;</code></small>
            </>;
        },
        isComplete(progress) {
            const node = getMemberNode(progress.editor);
            return node.data.expression?.length >= 15;
        },
    }, {
        ...viewOutputStep(),
    }],
};