import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import React from 'react';

const StyledReactTooltip = styled(ReactTooltip)`
    padding: .5em 1em !important;

    .multi-line {
        text-align: left !important;
    }
`;

export default function GlobalTooltip() {
    const afterShow = (event) => {
        // console.log(event);///
    };

    return (
        <StyledReactTooltip
            backgroundColor="#111"
            place="bottom"
            delayShow={250}
            afterShow={afterShow}
            multiline={true}
        />
    );
}
