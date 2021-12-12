import {css} from 'styled-components';

export const highlightStyle = css`
    box-shadow: 0 0 1.5rem #FFFA !important;
`;

export function getNodeSelector(id, key) {
    const selector = `.node-id-${id}`;
    return key ? `${selector} .prop.key-${key}` : selector;
}

export function highlightNode(id, key) {
    return css`
        ${getNodeSelector(id)} {
            ${highlightStyle}
        }

        ${(key || undefined) && css`
            ${getNodeSelector(id, key)} {
                //box-shadow: 0 0 .5rem #FFF !important;
                background: #FFF2 !important;
            }
        `}
    `;
}

export function highlightNodeShortcut(id, blockName) {
    return css`
        ${getNodeSelector(id)} .node-shortcut-button.shortcut-block-${blockName} {
            ${highlightStyle}
        }
    `;
}

export function highlightNodeSocket(id, blockName) {
    return css`
        ${getNodeSelector(id)} .node-shortcut-button.shortcut-block-${blockName} {
            ${highlightStyle}
        }
    `;
}

export function highlightContextMenuComponent(blockName) {
    return css`
        .context-menu .component-${blockName} {
            box-shadow: 0 0 .5rem #FFFA !important;
        }
    `;
}
