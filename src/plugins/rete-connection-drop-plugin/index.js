function install(editor, config = {}) {

    // let currentIO = null;
    //
    // editor.on('connectionpick', (io) => {
    //     currentIO = io;
    // });
    // editor.on('connectiondrop', (io) => {
    //     currentIO = null;
    // });

    const onKeyDown = (event) => {
        if(event.code === 'Escape') {
            // TODO: implement drop connection without context menu

            // if(currentIO) {
            //     editor.trigger('connectiondrop', currentIO);
            // }
            // setTimeout(() => editor.trigger('hidecontextmenu'));
        }
    };

    document.addEventListener('keydown', onKeyDown);
    editor.on('destroy', () => document.removeEventListener('keydown', onKeyDown));
}

const ConnectionDropPlugin = {
    name: 'connection-drop',
    install,
};
export default ConnectionDropPlugin;