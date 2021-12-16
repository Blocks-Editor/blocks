import classNames from 'classnames';
import MenuIcon from './MenuIcon';

export default function MenuAction({icon, color, selected, onAction, children, style, className, ...others}) {
    return (
        <div
            className={classNames(className, 'context-menu-action', selected && 'selected')}
            style={{color, userSelect: 'none', ...style}}
            onMouseDown={event => event.button === 0 && onAction?.(event)} {...others}>
            {icon && <MenuIcon>{icon}</MenuIcon>}
            {children}
        </div>
    );
}