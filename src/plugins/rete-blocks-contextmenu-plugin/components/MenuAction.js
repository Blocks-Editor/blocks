import classNames from 'classnames';
import MenuIcon from './MenuIcon';
import {onLeftPress} from '../../../utils/eventHelpers';

export default function MenuAction({icon, color, selected, onAction, children, style, className, ...others}) {
    return (
        <div
            className={classNames(className, 'context-menu-action', selected && 'selected')}
            style={{color, userSelect: 'none', ...style}}
            {...onLeftPress(event => onAction?.(event))}
            {...others}>
            {icon && <MenuIcon>{icon}</MenuIcon>}
            {children}
        </div>
    );
}