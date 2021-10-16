import classNames from 'classnames';
import MenuIcon from './MenuIcon';

export default function MenuAction({icon, selected, onAction, children, ...others}) {
    return (
        <div
            className={classNames('context-menu-action', selected && 'selected')}
            style={{userSelect: 'none'}}
            onMouseDown={event => event.button === 0 && onAction(event)} {...others}>
            {icon && <MenuIcon>{icon}</MenuIcon>}
            {children}
        </div>
    );
}