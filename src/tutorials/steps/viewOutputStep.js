import capitalize from '../../utils/capitalize';
import {TUTORIAL_LEFT_CLICK} from '../utils/tutorialText';
import {css} from 'styled-components';
import {animationStyle, highlightStyle} from '../utils/tutorialStyles';
import isOutputPanelHidden from '../../utils/isOutputPanelHidden';

export const viewOutputStep = () => {
    return {
        title: 'View the smart contract',
        info: `${capitalize(TUTORIAL_LEFT_CLICK)} the "Compile" button at the bottom right of the page.`,
        style: css`
            .compile-button {
                border: 1px solid white;
                ${highlightStyle}
                ${animationStyle}
            }
        `,
        isComplete(progress, {outputPanel}) {
            // Skip if output panel is unavailable
            return isOutputPanelHidden() || outputPanel;
        },
    };
};