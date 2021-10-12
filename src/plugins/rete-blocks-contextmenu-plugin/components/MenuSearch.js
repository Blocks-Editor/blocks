export default function MenuSearch(props) {
    let {value, onChange, onAction, onKeyDown} = props;

    let handleKeyDown = (onKeyDown || onAction) && (event => {
        if(onKeyDown) {
            onKeyDown(event);
        }
        if(onAction && event.keyCode === 13 /* Enter */) {
            onAction();
        }
    });

    return (
        <input
            type="text"
            className="context-menu-search"
            autoFocus
            ref={el => el && el.focus()}
            autoComplete="blocks-search"
            value={value || ''}
            onClick={event => event.stopPropagation()}
            onChange={onChange && (event => onChange(event.target.value))}
            onKeyDown={handleKeyDown}
        />
    );
}