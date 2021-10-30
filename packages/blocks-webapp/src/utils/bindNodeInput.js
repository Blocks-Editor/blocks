// Enable selecting input fields without dragging node
export const bindNodeInput = ref => ref && ref.addEventListener('pointerdown', event => event.stopPropagation());
