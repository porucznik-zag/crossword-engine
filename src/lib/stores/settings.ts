import { writable } from 'svelte/store';
import { alertStore } from './alerts';

interface SettingsState {
    isOpen: boolean;
    mustContainLetters: string[];
}

function createSettingsStore() {
    const initialState: SettingsState = {
        isOpen: false,
        mustContainLetters: []
    };
    const { subscribe, update, set } = writable<SettingsState>(initialState);

    return {
        subscribe,
        open: () => update(s => ({ ...s, isOpen: true })),
        close: () => update(s => ({ ...s, isOpen: false })),
        toggle: () => update(s => ({ ...s, isOpen: !s.isOpen })),
        
        // maxDots przekazujemy z zewnątrz, aby uniknąć cyklicznego importu searchStore
        toggleLetter: (letter: string, maxDots: number) => {
            update(state => {
                const { mustContainLetters } = state;

                if (mustContainLetters.includes(letter)) {
                    return { ...state, mustContainLetters: mustContainLetters.filter(l => l !== letter) };
                }

                if (mustContainLetters.length >= maxDots) {
                    alertStore.error("Zbyt mała ilość pustych pól w wyrażeniu dopasowania");
                    return state;
                }

                return { ...state, mustContainLetters: [...mustContainLetters, letter] };
            });
        },
        clearLetters: () => update(s => ({ ...s, mustContainLetters: [] })),
        reset: () => set(initialState)
    };
}

export const settingsStore = createSettingsStore();