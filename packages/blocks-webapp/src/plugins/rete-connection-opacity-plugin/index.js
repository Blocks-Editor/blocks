function install(editor, config = {}) {

    // const {minDistance = 500, opacityFalloff = 200} = config;

    // TODO: fix edge cases causing zero opacity on some devices / browsers

    // Fade out distant connections
    // editor.on(['renderconnection', 'updateconnection', 'zoom'], () => {
    //     setTimeout(() => {
    //         for(let pathElement of editor.view.container.querySelectorAll('.connection .main-path')) {
    //             let bounds = pathElement.getBoundingClientRect();
    //             let distance = bounds.width;
    //             pathElement.style.opacity = 1 / (1 + Math.sqrt(Math.max(distance - minDistance, 0) / opacityFalloff));
    //         }
    //     });
    // });
}

const ConnectionOpacityPlugin = {
    name: 'connection-opacity',
    install,
};
export default ConnectionOpacityPlugin;