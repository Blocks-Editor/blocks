import useLocalStorage from '../utils/useLocalStorage';

export default function useButtonTitleState() {
    return useLocalStorage('blocks.buttonTitles', false);
}