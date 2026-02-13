
# Wyszukiwarka haseł
Aplikacja internetowa służąca do szybkiego i precyzyjnego wyszukiwania słów pasujących do określonych wzorców. Narzędzie zostało zaprojektowane z myślą o wspomaganiu szaradzistów.

Projekt został stworzony w celach edukacyjnych oraz hobbystycznych.

## Funkcjonalność
Aplikacja oferuje zestaw narzędzi pozwalających na filtrowanie bazy słów według ściśle określonych kryteriów:

-   **Wyszukiwanie wzorcem:** Możliwość wpisywania znanych liter oraz zastępowania nieznanych znakiem kropki `.` (np. wpisanie `K.T` zwróci wyniki takie jak "KOT", "KAT", "KIT").
    
-   **Zakres długości:** Obsługa haseł o długości od 3 do 13 znaków.
    
-   **Obsługa polskich znaków:** Pełne wsparcie dla znaków diakrytycznych (ą, ę, ś, ć, ż, ź, ó, ł, ń).
    
-   **Filtrowanie liter wymaganych:** Opcja wskazania liter, które muszą znaleźć się w haśle, niezależnie od ich pozycji.
    
-   **Zaawansowane ograniczenia:** Możliwość zdefiniowania typu litery na konkretnej pozycji (samogłoska lub spółgłoska) poprzez menu kontekstowe (PPM na komputerze lub przytrzymanie na urządzeniach mobilnych).
    
-   **Synchronizacja z URL:** Stan wyszukiwania jest automatycznie zapisywany w pasku adresu przeglądarki, co umożliwia przesyłanie linków do konkretnych wyników oraz korzystanie z historii przeglądarki (wstecz/dalej).
    
-   **Skróty klawiszowe:** Kombinacja klawiszy `Shift + S` automatycznie przenosi kursor do pola wyszukiwania.

-   **Szybki powrót:** Podczas przewijania wyników jesteśmy w stanie szybko wrócić na samą górę strony dzięki przyciskowi powrotu.
    
-   **Responsywność:** Interfejs dostosowany do obsługi na komputerach stacjonarnych, tabletach i telefonach.
    

## Źródło danych
Baza wyrazów oraz definicji wykorzystywana w aplikacji została zaczerpnięta z serwisu **krzyzowkowo.pl**.

## Technologie
Projekt został zrealizowany w oparciu o następujący stos technologiczny:
-   **Svelte** 
-   **TypeScript**
-   **Tailwind CSS**
-   **Vite**
    

## Uruchomienie lokalne
Aby uruchomić projekt w środowisku lokalnym, wykonaj następujące kroki:

1.  Sklonuj repozytorium:
    ```bash
    git clone https://github.com/twoj-login/wyszukiwarka-hasel.git
    ```
    
2.  Przejdź do katalogu projektu:    
    ```bash
    cd wyszukiwarka-hasel
    ```
    
3.  Zainstaluj wymagane zależności:
    ```bash
    npm install  
    ```
    
4.  Uruchom serwer deweloperski:
    ```bash
    npm run dev  
    ```
    

## Status projektu i licencja
Projekt jest udostępniony na zasadach Open Source w celach podglądowych i edukacyjnych.

**Uwaga:** Obecnie projekt jest rozwijany wyłącznie przez autora i nie przyjmuje zewnętrznych zgłoszeń typu Pull Request. Zachęcam jednak do forkowania repozytorium i rozwijania własnych wersji aplikacji na bazie tego kodu.

##  Autor
**© Kamil Zagórski 2025**