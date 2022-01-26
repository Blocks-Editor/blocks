import NodeCompiler from './NodeCompiler';


export default class ConnectionCompiler extends NodeCompiler {

    // Same functionality as `NodeCompiler`, except defaults to the parent node rather than undefined

    defaultCompile(prop, node) {
        return node;
    }
}