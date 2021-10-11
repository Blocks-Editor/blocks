export const compatibleSocketInputComparator = (socket) => (input) => {
    return socket.compatibleWith(input.socket);
};

export const compatibleSocketOutputComparator = (socket) => (output) => {
    return output.socket.compatibleWith(socket);
};
