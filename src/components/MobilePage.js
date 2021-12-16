import React from 'react';
import styled from 'styled-components';

const MobilePanel = styled.div`
    width: 100%;
    height: 90vh;
`;

export default function MobilePage() {
    return (
        <MobilePanel className="d-flex flex-column align-items-center justify-content-center">
            <span className="display-3 pb-5">Hey there!</span>
            <span className="text-muted px-5">
                If you are interested in using Blocks on a mobile device,
                please check out
                <br/>
                <a href="https://github.com/Blocks-Editor/blocks/issues/78">this GitHub discussion</a>.
            </span>
        </MobilePanel>
    );
}