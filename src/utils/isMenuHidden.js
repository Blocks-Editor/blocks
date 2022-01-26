import getEmbedConfig from './getEmbedConfig';

export default function isMenuHidden() {
    return getEmbedConfig('menu') === 'hidden';
}