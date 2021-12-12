import {css} from 'styled-components';

export function getNodeSelector(id, key) {
    const selector = `.node-id-${id}`;
    return key ? `${selector} .prop.key-${key}` : selector;
}

export function highlightNode(id, key) {
    return css`
        ${getNodeSelector(id)} {
            box-shadow: 0 0 1rem #FFFA !important;
        }

        ${(key || undefined) && css`
            ${getNodeSelector(id, key)} {
                //box-shadow: 0 0 .5rem #FFF !important;
                background: #FFF2 !important;
            }
        `}
    `;
}
