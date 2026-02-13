import { writable } from 'svelte/store';
import { AlertType } from '../constants';

export interface AlertState {
    type: AlertType;
    message: string;
}

function createAlertStore() {
    const { subscribe, set } = writable<AlertState | null>(null);
    let timeoutId: number | undefined;

    return {
        subscribe,
        show: (type: AlertType, message: string, time: number = 4000) => {
            if (timeoutId) clearTimeout(timeoutId);
            set({ type, message });
            if (time > 0) {
                timeoutId = setTimeout(() => set(null), time);
            }
        },
        info: (msg: string) => alertStore.show(AlertType.INFO, msg),
        error: (msg: string) => alertStore.show(AlertType.ERROR, msg),
        warning: (msg: string) => alertStore.show(AlertType.WARNING, msg),
        clear: () => {
            if (timeoutId) clearTimeout(timeoutId);
            set(null);
        }
    };
}

export const alertStore = createAlertStore();