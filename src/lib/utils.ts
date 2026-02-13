import { type WordResult } from './constants';

export function countDots(str: string): number {
    return (str.match(/\./g) || []).length;
}

export function sanitizeInput(value: string): string {
    return value.toUpperCase().replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "."); 
}

export function formatExpression(value: string): string {
    return value.toUpperCase().replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, ".");
}

export async function fetchWords(length: number): Promise<WordResult[]> {
    const response = await fetch(`https://porucznik-zag.github.io/word-api/${length}-letter.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
    }
    
    return data as WordResult[];
}