import Rete from 'rete';

function sortConnections(io) {
    let key = io instanceof Rete.Input ? 'output' : 'input';
    io.connections.sort((a, b) => {
        let aPos = a[key].node.position;
        let bPos = b[key].node.position;
        return (aPos[1] - bPos[1]) || (aPos[0] - bPos[0]);
    });
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

const PositionSortPlugin = {
    name: 'position-sort',
    install,
};
export default PositionSortPlugin;