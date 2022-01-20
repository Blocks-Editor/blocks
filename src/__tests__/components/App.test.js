import React from 'react';
import App from '../../components/App';
import {render, waitFor} from '@testing-library/react';

it('renders without errors/warnings', async () => {

    /*const result = */render(<App/>);

    await waitFor(async () => {
        // noinspection JSCheckFunctionSignatures
        // expect(await result.findByText('hey() : async Text')).toBeInTheDocument();

        expect(window.EDITOR).toBeTruthy();
    });
});
