import {css, keyframes} from 'styled-components';

export const highlightStyle = css`
    box-shadow: 0 0 1.5rem #FFF !important;
`;

const animation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;
export const animationStyle = css`
    animation: ${animation} 1.5s ease-out infinite;
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

                input, select {
                    &:not(:focus) {
                        ${animationStyle}
                    }
                }
            }
        `}
    `;
}

export function highlightNodeSocket(id, key) {
    return css`
        ${highlightNode(id)}
        ${getNodeSelector(id)} .socket.key-${key} {
            ${animationStyle}
        }
    `;
}

export function highlightNodeShortcut(id, blockName) {
    return css`
        ${getNodeSelector(id)} .node-shortcut-button.shortcut-block-${blockName} {
            border: 2px solid white !important;
            ${highlightStyle}
            ${animationStyle}
        }
    `;
}

export function highlightContextMenuComponent(blockName) {
    return css`
        .context-menu .component-${blockName} {
            box-shadow: 0 0 .5rem #FFFA !important;
            border: 1px solid white;

            background: inherit !important;

            ${animationStyle}
        }
    `;
}
