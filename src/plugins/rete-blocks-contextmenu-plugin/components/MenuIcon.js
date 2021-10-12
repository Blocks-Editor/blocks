export default function MenuIcon(props) {
    let {children, color} = props;

    return (
        <span className="context-menu-icon" style={{color}}>{children}</span>
    );
}