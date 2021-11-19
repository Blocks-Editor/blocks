import {SHORTCUT_KEYS} from '../editor/shortcutKeys';
import {BLOCK_MAP} from '../editor/blocks';

it('contains valid block names', async () => {

    Object.values(SHORTCUT_KEYS).forEach((name) => {
        expect(BLOCK_MAP.has(name)).toBeTruthy();
    });
});
