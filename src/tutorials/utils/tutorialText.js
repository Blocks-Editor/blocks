import {isMobile} from 'react-device-detect';


export const TUTORIAL_LEFT_CLICK = !isMobile ? 'click' : 'tap';
export const TUTORIAL_CONTEXT_MENU_CLICK = !isMobile ? 'right click' : 'tap';
export const TUTORIAL_CLICK_DRAG = !isMobile ? 'click and drag' : 'touch and drag';
