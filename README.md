# PacketLab — nauka teleinformatyki

Responsywna, polskojęzyczna strona edukacyjna napisana w HTML, CSS i czystym JavaScript. Nie wymaga instalacji zależności, konta ani backendu.

## Uruchomienie

Otwórz `index.html` w aktualnej przeglądarce albo uruchom lokalny serwer:

```bash
cd /workspace/Repozytorium
python3 -m http.server 8000 --bind 127.0.0.1
```

Następnie otwórz adres serwera na swoim komputerze. Zatrzymaj serwer skrótem Ctrl+C. W środowisku chmurowym dostęp przeglądarki zależy od obsługi przekierowania portów; pliki można też pobrać i otworzyć lokalnie.

## Zawartość

- `index.html` — semantyczna struktura, menu, ścieżki nauki, laboratorium i egzaminy.
- `styles.css` — responsywne układy, ilustracja wykonana w CSS, style klawiatury i ograniczenie animacji zgodne z preferencjami użytkownika.
- `script.js` — menu mobilne, rozwijane materiały, symulator terminala i quiz.

Wyszukiwarka filtruje ścieżki według tytułów i treści materiałów. Pasek postępów pokazuje liczbę ścieżek oznaczonych jako opanowane.

### Materiały

1. **Sieci komputerowe:** OSI/TCP/IP, IPv4, podsieci, DNS, DHCP i diagnostyka.
2. **Linux:** terminal, pliki, uprawnienia i usługi.
3. **Windows Server:** Active Directory, DNS, OU, GPO i udziały.
4. **Egzaminy zawodowe:** osiem autorskich pytań z wyjaśnieniami, wynik i ponowne podejście. Strona wspomaga naukę do INF.02 i INF.07, ale nie zastępuje aktualnych informatorów ani oficjalnych arkuszy CKE.

Przyciski na kartach otwierają materiały z ćwiczeniami. Quiz pokazuje poprawną odpowiedź i wyjaśnienie po każdym wyborze. Wynik działa tylko w bieżącej sesji strony i nie jest zapisywany.

### Terminal

To **symulator**, który nie wykonuje poleceń systemowych, nie łączy się z siecią i nie odczytuje urządzenia użytkownika. Obsługuje dokładnie: `help`, `pwd`, `ls`, `whoami`, `ip addr`, `ping`, `clear`. Przykładowe odpowiedzi są stałe. Właściwe ćwiczenia administracyjne wykonuj we własnych, odizolowanych maszynach wirtualnych.

## Dostępność i prywatność

Strona zawiera odnośnik pomijający menu, etykiety pól, stan rozwinięcia menu, obsługę klawiatury i komunikaty quizu dla technologii asystujących. Nie zawiera analityki, plików cookie ani zewnętrznych skryptów. Oznaczenia opanowanych ścieżek są zapisywane lokalnie w `localStorage` pod kluczem `packetlab-progress`; nie są wysyłane na serwer. Można je cofnąć przyciskiem w materiale lub usunąć, czyszcząc dane witryny. Przy niedostępnej pamięci postępy działają tylko w bieżącej sesji. CSS pobiera opcjonalne fonty DM Sans i Manrope z Google Fonts (połączenie z usługą Google); bez internetu przeglądarka użyje fontów systemowych. Aby całkowicie wyeliminować zewnętrzne żądania, usuń linię `@import` z początku CSS. Link do CKE otwiera oficjalną stronę w nowej karcie.

## Sprawdzenie działania

- Sprawdź układ przy szerokości 375, 768 i 1440 pikseli.
- Na telefonie otwórz menu, przejdź do sekcji i sprawdź jego zamknięcie. Escape także zamyka menu.
- Otwórz i zamknij każdy z trzech materiałów.
- W terminalu sprawdź `help`, `ip addr`, nieznane polecenie oraz `clear`.
- Rozwiąż osiem pytań, sprawdź wynik i przycisk ponownej próby.
- Przejdź interaktywne elementy klawiszem Tab i sprawdź stronę bez dostępu do internetu.

## Publikacja

Umieść trzy pliki strony w jednym katalogu na dowolnym hostingu statycznym, np. GitHub Pages. Zachowaj względne ścieżki plików. Nie są potrzebne zmienne środowiskowe ani klucze API.

## Rozbudowa

Materiały znajdują się w obiekcie `lessons`, pytania w tablicy `questions`, a odpowiedzi terminala w obiekcie `commands` w `script.js`. Pole `correct` przechowuje indeks poprawnej odpowiedzi liczony od zera. Treści lekcji są zaufanym HTML autora — nie należy wstawiać tam niezweryfikowanych danych użytkowników.
