// Função auxiliar para vibração tátil
export const vibrate = (pattern: number | number[] = 20) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};
