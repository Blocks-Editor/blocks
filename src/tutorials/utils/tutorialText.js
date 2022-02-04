import {isMacOs, isMobile} from 'react-device-detect';


export const TUTORIAL_LEFT_CLICK = isMobile ? 'tap' : 'click';
export const TUTORIAL_CONTEXT_MENU_CLICK = isMobile ? 'tap' : 'right click';
export const TUTORIAL_CLICK_DRAG = isMobile ? 'tap and then drag' : 'click and drag';
export const TUTORIAL_CTRL = isMacOs ? 'CMD' : 'CTRL';
