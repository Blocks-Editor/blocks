export default function nodeIdentifierRef(node, key) {
    // TODO: ensure `id` is a valid identifier
    const type = node.component?.name || 'node';
    const id = typeof node === 'number' || typeof node === 'string' ? String(node) : node.id;
    return `${type}__${id}${key ? '_' + key : ''}`;
}
