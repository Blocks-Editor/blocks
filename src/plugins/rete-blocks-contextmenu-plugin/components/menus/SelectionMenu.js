import React, {useContext} from 'react';
import MenuAction from '../MenuAction';
import {MenuContext} from '../../contexts/MenuContext';
import jsonCopy from '../../../../utils/jsonCopy';
import {EDITOR_MENU_STORE} from '../../../../observables/editorMenuStore';

const cloneSelected = async (editor) => {

    const newNodeMap = {};

    let results = await Promise.all(editor.selected.list.map(async node => {
        const component = editor.getComponent(node.name);
        const newNode = await component.createNode(jsonCopy(node.data));

        newNode.meta = jsonCopy(node.meta);
        [newNode.position[0], newNode.position[1]] = [node.position[0] + 25, node.position[1] + 25];

        editor.addNode(newNode);

        newNodeMap[node.id] = newNode;

        return {
            original: node,
            clone: newNode,
        };
    }));

    results.forEach(({original}) => {
        // original.inputs.forEach((input) => {
        //     input.connections.forEach((connection) => {
        //         const newInputNode = newNodeMap[connection.input.node.id];
        //         const newOutputNode = newNodeMap[connection.output.node.id];
        //         if(!newInputNode || !newOutputNode) {
        //             return;
        //         }
        //         const input = newInputNode.inputs.get(connection.input.key);
        //         const output = newOutputNode.outputs.get(connection.output.key);
        //         if(!input || !output) {
        //             return;
        //         }
        //         editor.connect(output, input);
        //     });
        // });

        editor.selected.remove(original);
        original.update();
    });

    // TODO: select after clone (capture mouse click)
    // results.forEach(({clone}) => {
    //     editor.selected.add(clone);
    //     clone.update();
    // });
};

export default function SelectionMenu() {

    const {editor} = useContext(MenuContext);

    return (
        <>
            <MenuAction onAction={() => EDITOR_MENU_STORE.set('reference')}>Info</MenuAction>
            <MenuAction onAction={() => cloneSelected(editor)}>Clone</MenuAction>
            <MenuAction onAction={() => editor.selected.each(node => editor.removeNode(node))}>Delete</MenuAction>
        </>
    );
}