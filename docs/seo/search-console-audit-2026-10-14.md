# Audyt Search Console — biuro-motylska.pl

- **Data audytu:** 2026-10-14
- **Właściwość:** `https://biuro-motylska.pl/` (uprawnienie: `siteOwner`)
- **Typ wyszukiwania:** web · **data_state:** `all`
- **Cel biznesowy:** kwalifikowane zapytania od przedsiębiorców ze Zduńskiej Woli i okolic (telefon, e-mail, formularz kontaktowy). Pozycja średnia nie jest celem samym w sobie.
- **Poufność:** repozytorium jest **publiczne**. Raport zawiera pełne dane zapytań i stron — ogólne frazy branżowe, bez danych osobowych i bez informacji o klientach.
- **Poprzedni audyt:** `docs/seo/search-console-audit-2026-09-01.md`

> `sc-domain:biuro-motylska.pl` istnieje równolegle, ale ma uprawnienie `siteUnverifiedUser` (brak danych). Cały audyt opiera się na właściwości z prefiksem URL, zgodnie z poprzednim raportem.

## Okna analizy

Ustalone przez `get_seo_audit_baseline`, stabilny cutoff `2026-10-11` (odcięte 3 ostatnie dni).

| Okno | Zakres | Uwaga |
| --- | --- | --- |
| Bieżące 28 dni | 2026-09-14 → 2026-10-11 | **okno główne tego audytu** |
| Poprzednie 28 dni | 2026-08-17 → 2026-09-13 | punkt odniesienia |
| Bieżące 90 dni | 2026-07-14 → 2026-10-11 | — |
| Poprzednie 90 dni | 2026-04-15 → 2026-07-13 | brak danych (serwis jeszcze nie rankował) |
| Rok wcześniej | 2025-07-14 → 2025-10-11 | brak danych |

Serwis ma teraz ok. 2,5 miesiąca historii widoczności — porównanie 28-dniowe jest jedynym miarodajnym oknem okres-do-okresu; porównania 90-dniowe i rok-do-roku wciąż niemożliwe.

## Migawka wyników (okno główne)

| Metryka | Bieżące 28 dni | Poprzednie 28 dni | Zmiana |
| --- | ---: | ---: | ---: |
| Kliknięcia | 5 | 27 | **−81,5%** |
| Wyświetlenia | 313 | 441 | −29,0% |
| CTR | 1,60% | 6,12% | **−4,52 pp** |
| Średnia pozycja | 8,0 | 12,8 | **+4,8 (poprawa)** |

Sygnał jest nietypowy: pozycja wyraźnie się poprawiła, ale kliknięcia i CTR zapadły się głęboko. To nie jest spadek widoczności — to spadek klikalności przy lepszym rankingu.

## Trzy najważniejsze ustalenia

### 1. Niemal cała utrata kliknięć pochodzi z jednej strony — strony głównej, i głównie z mobile

**Dowód (strona, 2026-08-17→09-13 vs 2026-09-14→10-11):** `/` straciła 22 z 23 kliknięć netto całej witryny (26→4, **−84,6%**), mimo że pozycja się poprawiła (12,7→8,5) i wyświetlenia spadły tylko o 19,5% (323→260).

**Dowód (urządzenie, ten sam zakres dat, przefiltrowane po stronie `/`):**

| Urządzenie | Okres 1: klik./wyśw./CTR/poz. | Okres 2: klik./wyśw./CTR/poz. |
| --- | --- | --- |
| Mobile | 3 / 30 / 10,0% / 10,6 | **0 / 52 / 0% / 7,7** |
| Desktop | 1 / 150 / 0,67% / 17,2 | 1 / 71 / 1,41% / 14,6 |

Mobile: CTR spadł z 10% do 0%, mimo poprawy pozycji (10,6→7,7). Desktop: CTR lekko wzrósł (0,67%→1,41%) mimo pogorszenia pozycji. Spadek jest skoncentrowany na mobile.

**Zastrzeżenie:** suma wyświetleń z zapytania przefiltrowanego po urządzeniu (180) nie zgadza się z sumą z zapytania po stronie (260–323) dla tego samego zakresu dat i tej samej strony — to udokumentowana niespójność agregacji Google Search Analytics (routing „byPage" vs „byProperty"), nie błąd w tym audycie. Liczby bezwzględne traktuję jako orientacyjne; **względny wzorzec mobile-w-dół / desktop-stabilny** jest spójny w obu zapytaniach i to on stanowi dowód.

**Interpretacja:** to dokładnie wzorzec z macierzy diagnostycznej playbooka: *„Mobile declines but desktop does not → mobile rendering, content parity, UX, or mobile SERP difference"*. Tytuł strony głównej jest stabilny od 2026-08-07, meta description od 2026-08-27 — oba poprzedzają początek zapaści (ok. 2026-09-10) o 2+ tygodnie, więc **nie są bezpośrednią przyczyną**. Repozytorium ma historię błędów specyficznych dla mobile (np. `f875c40 Fix mobile hero stats layout`), więc regresja renderowania na mobile jest wiarygodną hipotezą, ale **niepotwierdzoną** — nie mogłem zweryfikować żywego renderowania: środowisko audytu blokuje wychodzące połączenia do `biuro-motylska.pl` (ograniczenie sandboxa, nie wynik testu).

**Priorytet:** krytyczny · **Pewność przyczyny:** niska · **Pewność, że to największy pojedynczy problem na stronie:** wysoka

### 2. Fraza flagowa „biuro rachunkowe zduńska wola" — pozycja gwałtownie lepsza, ale kliknięcia w dół (rozstrzygnięcie eksperymentu E3)

**Dowód:** 4 klik./88 wyśw./CTR 4,55%/poz. 17,6 → **1 klik./75 wyśw./CTR 1,33%/poz. 8,9**.

**Rozstrzygnięcie wg reguły z poprzedniego audytu** („Wsparcie: pozycja < 15"): pozycja 8,9 jest wyraźnie poniżej progu 15 → **E3: WSPARCIE**. Działania poza repozytorium (wizytówka Google, opinie, NAP) najwyraźniej zaczynają działać na pozycję.

Jednocześnie jest to ta sama strona i w dużej mierze ta sama dynamika co w Ustaleniu 1 — poprawa pozycji nie przełożyła się na więcej kliknięć, tylko na mniej. Reguła decyzyjna z poprzedniego audytu patrzyła wyłącznie na pozycję, więc formalnie eksperyment jest rozstrzygnięty pozytywnie, ale **nie należy tego czytać jako sukcesu biznesowego** — to ten sam alarm co wyżej, z innej strony.

**Priorytet:** wysoki (do interpretacji łącznie z Ustaleniem 1) · **Pewność:** wysoka (dane, nie przyczyna)

### 3. Eksperyment E1 (tytuł `/kpir-ryczalt`) odrzucony; E2 (kotwica do `/pelna-ksiegowosc`) wciąż nierozstrzygnięty na korzyść strony docelowej

**E1 — `/kpir-ryczalt`, zapytanie „księgi przychodów i rozchodów zduńska wola":** od wdrożenia nowego tytułu (2026-09-01) skumulowane ~55 wyświetleń, **0 kliknięć**. W bieżącym oknie: 17 wyśw., poz. 3,8 (≤8), CTR 0% → spełnia próg odrzucenia z poprzedniego audytu („CTR = 0% przy ≥15 wyśw. i poz. ≤8"). **Rozstrzygnięcie: ODRZUCONY.** Zastrzeżenie: przy 17 wyświetleniach i np. 5% prawdziwym CTR, 0 kliknięć wciąż mieści się w normalnej zmienności próby — nie polecam kolejnej spekulacyjnej zmiany tytułu na tej stronie teraz.

**E2 — kotwica „księgi rachunkowe" → `/pelna-ksiegowosc` (wdrożona 2026-09-01):** w bieżącym oknie, dla zapytania „księgi rachunkowe zduńska wola" (rozbicie po stronie): `/ksiegowosc-spolki-zoo` poz. **12,5** (13 wyśw.) nadal wyprzedza `/pelna-ksiegowosc` poz. **24** (10 wyśw.) i `/` poz. 28,5 (11 wyśw.). Reguła wsparcia („`/pelna-ksiegowosc` wyprzedza obie strony siostrzane") **nie jest spełniona**. Co istotne: tytuł `/pelna-ksiegowosc` już zawiera dokładną frazę „księgi rachunkowe", a mimo to przegrywa ze stroną, która tej frazy w tytule nie ma — to **nie jest problem dopasowania treści, tylko autorytetu/linkowania wewnętrznego**. Jeden dodany link nie wystarczył.

**Priorytet:** średni (E1), wysoki (E2 — jest tu konkretna, wykonalna dźwignia) · **Pewność:** średnia

## Mapa szans wyszukiwania

| Zapytanie / klaster | Wyśw. | Klik. | CTR | Pozycja | Strona(y) | Ścieżka |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| biuro rachunkowe zduńska wola | 75 | 1 | 1,33% | 8,9 | `/` | Monitor — patrz Ustalenie 1 i 2 |
| księgi rachunkowe zduńska wola | 34¹ | 0 | 0% | 12,5–28,5 | `/ksiegowosc-spolki-zoo` (12,5), `/pelna-ksiegowosc` (24), `/` (28,5) | Consolidate signal — wzmocnij linkowanie do `/pelna-ksiegowosc` |
| księgi przychodów i rozchodów zduńska wola | 17 | 0 | 0% | 3,8 | `/kpir-ryczalt` | Monitor — nie zmieniaj dalej (E1 odrzucony) |
| kadry i płace zduńska wola | 7 | 0 | 0% | 7,4 | `/kadry-i-place` | Monitor |
| usługi rachunkowe zduńska wola | 9 | 0 | 0% | 17,2 | `/` | Monitor |
| biura rachunkowe zduńska wola | 20 | 0 | 0% | 11,3 | `/` | Monitor |
| dokumentacja kadrowo-płacowa kutno | 5 | 0 | 0% | 30,2 | `/kadry-i-place` | Nowe — za mało danych, obserwować |

¹ Suma z rozbicia po stronach (11+13+10=34); zagregowane zapytanie zwróciło 16 — kolejny przykład niespójności agregacji Google (patrz Ograniczenia danych).

## Ustalenia techniczne i indeksacja — bez zmian

| Sprawdzenie | Status |
| --- | --- |
| Indeksacja (`/`, `/pelna-ksiegowosc`, `/ksiegowosc-spolki-zoo`, `/kpir-ryczalt`) | Pass — 4/4 zaindeksowane |
| Kanoniczność | Pass — 0 rozbieżności |
| Blokady robots | Pass — 0 |
| Problemy pobierania | Pass — 0 |
| Sitemap | Valid, 7 URL-i, 0 błędów, 0 ostrzeżeń, pobrana 2026-10-10 |
| Wyniki rozszerzone (`searchAppearance`) | Nadal **0 wierszy** w oknie 2026-07-14→10-11 — bez zmian względem poprzedniego audytu |

Brak dowodów na problem techniczny. Zapadka klikalności nie jest spowodowana indeksacją, kanonicznością ani sitemapą.

## Prioritized actions

| Priorytet | Ustalenie i dowód | Działanie | Status wykonania | Wpływ | Nakład | Pewność |
| --- | --- | --- | --- | --- | --- | --- |
| **Krytyczny** | Strona główna: −84,6% kliknięć, CTR mobile 10%→0% mimo lepszej pozycji (Ustalenie 1) | Ręcznie sprawdzić żywe renderowanie strony głównej na telefonie (Core Web Vitals, czy nic się nie psuje wizualnie, czy wygląd w wynikach Google nie zmienił się niezależnie od naszych tagów) | **Needs input or access** — środowisko audytu nie ma dostępu do żywej domeny | Odzyskanie większości utraconych kliknięć, jeśli to rzeczywiście regresja | Małe (inspekcja) → średnie, jeśli wymaga poprawki | Niska (przyczyna niepotwierdzona) |
| **Wysoki** | E2 nierozstrzygnięty: `/pelna-ksiegowosc` (poz. 24) wciąż za `/ksiegowosc-spolki-zoo` (poz. 12,5) mimo trafnego tytułu | Dodać 2–3 kolejne linki wewnętrzne z kotwicą „księgi rachunkowe" do `/pelna-ksiegowosc` z innych stron (strona główna, `/vat-jpk`, `/kadry-i-place`) — jeden link z poprzedniego audytu nie wystarczył | **Needs input or access** — czekam na Twoją zgodę przed zmianą kodu | Konsolidacja sygnału rankingowego na właściwym URL-u | Małe | Średnia |
| **Średni** | E1 odrzucony: `/kpir-ryczalt` nadal CTR 0% przy doskonałej pozycji (3,8) | **Nie zmieniać** dalej tytułu/opisu tej strony; pozwolić danym się zebrać | Needs input or access (decyzja: czy zaakceptować „nic nie rób") | Unika marnowania wysiłku na szum statystyczny | Brak | Średnia |
| **Wysoki (biznesowo), poza repo** | E3 wsparty: pozycja dla frazy flagowej poprawiła się (21,3→8,9), ale kliknięcia nadal słabe | Kontynuować działania przy wizytówce Google / opiniach / spójności NAP — to wciąż największa dźwignia, i leży całkowicie poza repozytorium | Needs input or access — poza zakresem kodu | Potencjalnie największy wzrost kwalifikowanych kliknięć | Średnie–duże, poza repo | Średnia |
| **Niski** | Nowe zapytania spoza pierwotnego obszaru (np. „...kutno") pojawiają się przy bardzo małym wolumenie | Nie tworzyć nowych stron ani treści teraz — obserwować do następnego audytu | Measure later | Zbyt wcześnie na ocenę | — | Niska |

Żadne z powyższych działań nie zostało wdrożone w tym przebiegu — zgodnie z Twoją instrukcją czekam na akceptację przed zmianą kodu strony.

## Backlog eksperymentów (aktualizacja)

| Eksperyment | Strona | Baza (2026-09-14→10-11) | Zmiana | Oczekiwany efekt | Ponowny audyt | Reguła decyzyjna |
| --- | --- | --- | --- | --- | --- | --- |
| E1 — pełna fraza w tytule | `/kpir-ryczalt` | **ZAMKNIĘTY: ODRZUCONY** | — | — | — | CTR pozostał 0% przy poz. ≤8 i ≥15 wyśw. |
| E2 — kotwica opisowa | `/pelna-ksiegowosc` | 10 wyśw., poz. 24 (wciąż za `/ksiegowosc-spolki-zoo`) | Dodać więcej linków z kotwicą „księgi rachunkowe" (czeka na akceptację) | `/pelna-ksiegowosc` wyprzedza strony siostrzane | 28 dni po wdrożeniu | Wsparcie: `/pelna-ksiegowosc` najwyżej z trzech |
| E3 — wizytówka i opinie | `/` | **ZAMKNIĘTY: WSPARTY** (pozycja) | — | Kontynuować poza repo; monitorować kliknięcia osobno | — | Pozycja < 15 osiągnięta; nowy wskaźnik do śledzenia: kliknięcia/CTR na tej frazie |
| **E4 (nowy) — mobile CTR na stronie głównej** | `/` | Mobile: 0 klik./52 wyśw./CTR 0%/poz. 7,7 (2026-09-14→10-11) | Do ustalenia po ręcznej inspekcji żywego renderowania mobile | CTR mobile > 0% przy stabilnej/lepszej pozycji | 28 dni po ewentualnej poprawce, lub kolejny regularny audyt (2026-11-11+) jeśli brak zmian | Odrzucenie, jeśli CTR mobile nadal 0% przy ≥50 wyśw. i poz. ≤10 po dwóch kolejnych oknach |

## Wdrożone po akceptacji (2026-10-14, po publikacji audytu)

Użytkownik zaakceptował wyłącznie poprawkę #2 (E2 — wzmocnienie sygnału linkowania do `/pelna-ksiegowosc`). Pozostałe cztery poprawki (#1, #3, #4, #5) pozostają niewdrożone, zgodnie z decyzją użytkownika.

| Zmiana | Plik | Kotwica |
| --- | --- | --- |
| Nowy link kontekstowy w FAQ „Kiedy trzeba przejść na pełną księgowość?" | `index.html` | „pełną księgowość" |
| Nowe zdanie łączące ewidencję VAT z pełnymi księgami rachunkowymi | `vat-jpk.html` | „pełne księgi rachunkowe" |
| Nowe zdanie łączące listy płac z pełnymi księgami rachunkowymi | `kadry-i-place.html` | „pełne księgi rachunkowe" |

Razem z linkiem już istniejącym w `ksiegowosc-spolki-zoo.html` (wdrożonym w poprzednim audycie), `/pelna-ksiegowosc` ma teraz 4 kontekstowe linki wewnętrzne z wariantami frazy „księgi rachunkowe" (poza linkami nawigacyjnymi i kartami usług).

**Weryfikacja:** sprawdzono ręcznie, że wszystkie trzy edycje tworzą poprawny HTML (otwarte/zamknięte tagi `<a>`, akapity nienaruszone).

**Plan pomiaru:** reguła decyzyjna E2 bez zmian — 28 dni po wdrożeniu, próg wsparcia: `/pelna-ksiegowosc` wyprzedza `/ksiegowosc-spolki-zoo` i `/` dla zapytania „księgi rachunkowe zduńska wola". Najbliższe sensowne okno oceny: od 2026-11-11.

## Ograniczenia danych

- Serwis ma ~2,5 miesiąca historii — porównania 90-dniowe i rok-do-roku wciąż niemożliwe; jedyne miarodajne okno to 28 dni.
- Bezwzględne liczby są małe (5–27 kliknięć/28 dni) — procenty i CTR są z natury niestabilne na tak małej próbie (zastrzeżenie playbooka: „small samples produce unstable CTR and percentage changes").
- Potwierdzona niespójność agregacji Google Search Analytics: zapytanie po stronie, po urządzeniu i zagregowane po zapytaniu zwracają **różne sumy** dla tego samego zakresu dat i tej samej strony/zapytania. Potraktowano to jako ograniczenie danych, nie błąd metodologii — zgodnie ze wskazówką playbooka, że tabele i wykresy Google nie muszą się sumować identycznie.
- `pagination.coverage.complete_dataset: false` — Google zwraca wiersze najwyższe, nie gwarantuje kompletności zbioru.
- Nie udało się zweryfikować żywego renderowania strony na mobile — środowisko audytu blokuje wychodzące połączenia do `biuro-motylska.pl` (ograniczenie infrastruktury audytu, nie ustalenie o stronie).
- Brak podłączonych danych o konwersjach — Search Console mierzy widoczność i kliknięcia, nie wartość biznesową.

## Zapisany raport

Ten plik: `docs/seo/search-console-audit-2026-10-14.md`. Zawiera pełne, nieredagowane dane zapytań i stron (wyłącznie ogólne frazy branżowe, bez danych osobowych) — zgodnie z konwencją poprzedniego audytu. **Plik jest zapisany lokalnie w repozytorium, ale jeszcze niezacommitowany/niewypchnięty** — czekam na Twoją decyzję, zanim to opublikuję.
