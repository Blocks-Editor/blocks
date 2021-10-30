import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import React from 'react';

const ReactTooltipStyled = styled(ReactTooltip)`
  padding: .5em 1em;
`;

export default function GlobalTooltip() {
    return <ReactTooltipStyled className="tooltip" backgroundColor="#111" place="bottom"/>;
};