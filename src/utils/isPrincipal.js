const regex = /^[0-9a-z-]+$/;

// TODO: verify based on check sequence
export default function isPrincipal(string) {
    return typeof string === 'string' && regex.test(string);
}