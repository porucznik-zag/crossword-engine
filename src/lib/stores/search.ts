import { writable, get } from 'svelte/store';
import { alertStore } from './alerts';
import { settingsStore } from './settings';
import { fetchWords, formatExpression } from '../utils';
import { ConstraintType, VOWELS, type WordResult } from '../constants';

interface SearchState {
    expression: string;
    results: WordResult[];
    isLoading: boolean;
    constraints: Map<number, ConstraintType>;
}

function createSearchStore() {
    const { subscribe, set, update } = writable<SearchState>({
        expression: "",
        results: [],
        isLoading: false,
        constraints: new Map()
    });

    // Helpers URL
    const updateUrl = (expression: string) => {
        const url = new URL(window.location.href);
        if (expression) {
            url.searchParams.set('q', expression);
            window.history.pushState({ path: url.href }, '', url.href);
        } else {
            url.searchParams.delete('q');
            window.history.replaceState({ path: url.href }, '', url.href);
        }
    };

    return {
        subscribe,

        setExpression: (val: string) => {
            update(s => ({ ...s, expression: formatExpression(val), constraints: new Map() }));
        },

        setConstraint: (index: number, type: ConstraintType) => {
            update(s => {
                const newConstraints = new Map(s.constraints);
                if (type === ConstraintType.NONE) {
                    newConstraints.delete(index);
                } else {
                    newConstraints.set(index, type);
                }
                return { ...s, constraints: newConstraints };
            });
        },

        checkConstraints: (word: string, constraints: Map<number, ConstraintType>): boolean => {
            for (const [index, type] of constraints.entries()) {
                const char = word[index];
                const isVowel = VOWELS.includes(char);

                if (type === ConstraintType.VOWEL && !isVowel) return false;
                if (type === ConstraintType.CONSONANT && isVowel) return false;
            }
            return true;
        },

        clearConstraints: () => {
            update(s => ({ ...s, constraints: new Map() }));
        },

        clear: () => {
            set({ expression: "", results: [], isLoading: false, constraints: new Map() });
            settingsStore.clearLetters();
            const url = new URL(window.location.href);
            url.searchParams.delete('q');
            window.history.pushState({}, '', url.href);
        },

        // Init: Nasłuchiwanie URL i Back Button
        init: () => {
            const params = new URLSearchParams(window.location.search);
            const query = params.get('q');
            
            if (query) {
                update(s => ({ ...s, expression: formatExpression(query) }));
                searchStore.execute(true); // true = skip URL update
            }

            window.onpopstate = () => {
                const currentParams = new URLSearchParams(window.location.search);
                const currentQuery = currentParams.get('q');
                if (currentQuery) {
                    update(s => ({ ...s, expression: formatExpression(currentQuery) }));
                    searchStore.execute(true);
                } else {
                    set({ expression: "", results: [], isLoading: false, constraints: new Map() });
                }
            };
        },

        execute: async (fromUrl = false) => {
            const state = get(searchStore);

            if (!fromUrl) {
                updateUrl(state.expression);
            }

            if (state.expression.length <= 2) {
                alertStore.error("Wyrażenie dopasowania musi zawierać co najmniej 3 znaki");
                return;
            }

            update(s => ({ ...s, isLoading: true, results: [] }));

            try {
                const data = await fetchWords(state.expression.length);
                const mustContain = get(settingsStore).mustContainLetters;
                const pattern = state.expression;

                const regex = new RegExp(
                    "^" + pattern.replace(/\./g, "[A-ZĄĆĘŁŃÓŚŹŻ]") + "$", 
                    "i"
                );
                
                const dotPositions = [...pattern]
                    .map((char, index) => (char === "." ? index : -1))
                    .filter(index => index !== -1);

                const matches = data.filter(item => {
                    const word = item.word.toUpperCase();
                    
                    // 1. Regex check
                    if (!regex.test(word)) return false;
                    
                    // 2. Must contain letters check
                    const hasLetters = mustContain.every(letter => 
                        dotPositions.some(pos => word[pos] === letter)
                    );
                    if (!hasLetters) return false;

                    // 3. Constraints check (Samogłoska/Spółgłoska)
                    return searchStore.checkConstraints(word, state.constraints);
                });

                if (matches.length === 0) {
                    alertStore.info("Nie znaleziono wyników dla podanego wzorca");
                }

                update(s => ({ ...s, results: matches, isLoading: false }));

            } catch (err) {
                console.error(err);
                alertStore.error("Nie udało się wczytać danych");
                update(s => ({ ...s, isLoading: false }));
            }
        }
    };
}

export const searchStore = createSearchStore();