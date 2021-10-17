import Rete from 'rete';

function sortConnections(io) {
    let key = io instanceof Rete.Input ? 'output' : 'input';
    io.connections.sort((a, b) => a[key].node.position[1] - b[key].node.position[1]);
}

function install(editor, config = {}) {
    editor.on('connectioncreated', connection => {
        sortConnections(connection.input);
        sortConnections(connection.output);
    });
    editor.on('nodedragged', (node) => {
        for(let [ioMap, key] of [[node.inputs, 'output'], [node.outputs, 'input']]) {
            for(let io of ioMap.values()) {
                for(let connection of io.connections) {
                    sortConnections(connection[key]);
                }
            }
        }
    });
}

const VerticalSortPlugin = {
    name: 'connection-sort',
    install,
};
export default VerticalSortPlugin;