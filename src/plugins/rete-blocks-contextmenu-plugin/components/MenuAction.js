import classNames from 'classnames';
import MenuIcon from './MenuIcon';

export default function MenuAction(props) {
    let {icon, selected, onAction, children, ...others} = props;

    return (
        <div
            className={classNames('context-menu-action', selected && 'selected')}
            onMouseDown={event => event.button === 0 && onAction(event)} {...others}>
            {icon && <MenuIcon>{icon}</MenuIcon>}
            {children}
        </div>
    );
}