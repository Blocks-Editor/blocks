import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import React from 'react';
import {isMobile} from 'react-device-detect';

const StyledReactTooltip = styled(ReactTooltip)`
    z-index: 1000;
    padding: .5em 1em !important;

    .multi-line {
        text-align: left !important;
    }
`;

export default function GlobalTooltip() {
    // const afterShow = (event) => {
    //     console.log(event);///
    // };

    return (
        <StyledReactTooltip
            disable={isMobile}
            backgroundColor="#111"
            place="bottom"
            delayShow={200}
            // afterShow={afterShow}
            multiline={true}
        />
    );
}
