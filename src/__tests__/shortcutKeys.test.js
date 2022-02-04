import {SHORTCUT_KEY_MAP} from '../editor/shortcutKeys';
import {BLOCK_MAP} from '../editor/blocks';

it('contains valid block names', async () => {

    Object.values(SHORTCUT_KEY_MAP).forEach((name) => {
        expect(BLOCK_MAP.has(name)).toBeTruthy();
    });
});
