import Rete from 'rete';

export default class BaseComponent extends Rete.Component {

    getEditorNode(node) {
        return this.editor.nodes.find(n => n.id === node.id);
    }

    getControls(node) {
        return this.getEditorNode(node).controls;
    }
}