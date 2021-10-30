import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import React from 'react';

const ReactTooltipStyled = styled(ReactTooltip)`
  padding: .5em 1em !important;
`;

export default function GlobalTooltip() {
    return <ReactTooltipStyled backgroundColor="#111" place="bottom"/>;
};