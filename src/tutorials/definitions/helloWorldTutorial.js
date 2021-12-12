import {CONTEXT_MENU_STORE} from '../../observables/contextMenuStore';

export const helloWorldTutorial = {
    id: 'hello-world',
    title: 'Hello, world!',
    info: 'Create a simple "Hello World" program',
    setupVariables(progress) {
        return {
            contextMenu: CONTEXT_MENU_STORE,
        };
    },
    steps: [{
        title: 'Create a function',
        info: 'Right-click to open the context menu.',
        isComplete(progress, {contextMenu}) {
            return contextMenu && !contextMenu.node;
        },
    }, {
        title: 'Create a function',
        info: 'Select the "Function" block.',
        checkpoint: true,////
        // render(progress) {
        //     const component = progress.editor.components.get('Function');
        //     return (
        //         <ContextMenu>
        //             <MenuComponent component={component}/>
        //         </ContextMenu>
        //     );
        // },
        isComplete(progress) {
            return false;
        },
    }, {
        title: '',
        info: '',
    }],
};