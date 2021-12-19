import {getExampleProjects} from '../examples/examples';
import {act, render, waitFor} from '@testing-library/react';
import App from '../components/App';
import React from 'react';
import {EDITOR_STORE} from '../observables/editorStore';
import compileGlobalMotoko from '../compilers/utils/compileGlobalMotoko';

for(const example of getExampleProjects()) {
    it(`compiles "${example.name}" example as expected`, async () => {

        expect(example.output).toBeTruthy();

        // Manually reset global editor
        EDITOR_STORE.set(null);

        render(<App/>);

        let editor;
        await waitFor(async () => {
            editor = EDITOR_STORE.get();
            expect(editor).toBeTruthy();
        });

        await act(async () => {
            await editor.fromJSON(example);
        });

        expect(editor.nodes.length).toBeGreaterThan(0);

        expect(compileGlobalMotoko(editor)).toEqual(example.output);
    });
}