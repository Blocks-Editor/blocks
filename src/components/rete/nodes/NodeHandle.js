import React from 'react';
import {Node} from 'rete-react-render-plugin';
import {getBlock} from '../../../editor/blocks';
import DefaultNodeView from './views/DefaultNodeView';

export default class NodeHandle extends Node {
    render() {
        const {node} = this.props;

        const block = getBlock(node.name);

        const NodeView = block.component || DefaultNodeView;
        return <NodeView block={block} nodeHandle={this}/>;
    }
}