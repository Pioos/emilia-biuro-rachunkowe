# Audyt Search Console — biuro-motylska.pl

- **Data audytu:** 2026-09-01
- **Właściwość:** `https://biuro-motylska.pl/` (uprawnienie: `siteOwner`)
- **Typ wyszukiwania:** web · **data_state:** `all`
- **Cel biznesowy:** kwalifikowane zapytania od przedsiębiorców ze Zduńskiej Woli i okolic (telefon, e-mail, formularz kontaktowy)
- **Poufność:** repozytorium jest **publiczne**. Raport zawiera pełne dane zapytań i stron — to ogólne frazy branżowe, bez danych osobowych i bez informacji o klientach. Wersję zredagowaną można przygotować na życzenie.

> `sc-domain:biuro-motylska.pl` również istnieje, ale z uprawnieniem `siteUnverifiedUser` (brak dostępu do danych). Cały audyt opiera się na właściwości z prefiksem URL.

## Okna analizy

| Okno | Zakres | Uwaga |
| --- | --- | --- |
| Bieżące 90 dni | 2026-06-01 → 2026-08-29 | stabilne, odcięte 3 ostatnie dni |
| Poprzednie 90 dni | 2026-03-03 → 2026-05-31 | brak danych (serwis nie istniał) |
| Rok wcześniej | 2025-06-01 → 2025-08-29 | brak danych |
| Bieżące 28 dni | 2026-08-02 → 2026-08-29 | **tożsame z oknem 90-dniowym** |

`data_quality.stable_window: true`, bez korekty na dane niekompletne. Pierwsze wyświetlenie odnotowano **2026-08-08**, więc porównania okres-do-okresu i rok-do-roku są niemożliwe.

## Migawka wyników

| Metryka | Bieżące 90 dni | Poprzednie 90 dni | Zmiana |
| --- | ---: | ---: | ---: |
| Kliknięcia | 16 | 0 | brak bazy |
| Wyświetlenia | 268 | 0 | brak bazy |
| CTR | 5,97% | — | brak bazy |
| Średnia pozycja | 12,2 | — | brak bazy |

Trend dzienny rośnie: 8–16 sierpnia po kilka wyświetleń dziennie, 27–29 sierpnia odpowiednio 35, 33 i 21.

### Higiena danych

Z 268 wyświetleń **22 pochodzą z 6 zapytań zawierających operatory** `-site:reddit.com -site:twitter.com …`. To zapytania narzędzi automatycznych, nie użytkowników. Korelują z ruchem z Brazylii, Indii, USA i innych krajów (łącznie ~37 wyświetleń). **Wykluczono je z analizy CTR i pozycji.**

Kolejne **12 wyświetleń** to `motyle zduńska wola` (pozycja 3,9) — kolizja nazwy „Motylska" z owadami. To zapytanie nigdy nie skonwertuje.

Realna baza: **~234 wyświetlenia** od użytkowników zainteresowanych usługami księgowymi.

## Mapa szans wyszukiwania

| Zapytanie | Wyśw. | Klik. | CTR | Pozycja | Strona rankująca | Ścieżka |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| biuro rachunkowe zduńska wola | 49 | 4 | 8,16% | 23,4 | `/` (47 @ 21,3) | Improve existing page |
| księgi rachunkowe zduńska wola | 18 | 0 | 0% | 21,6 | `/pelna-ksiegowosc` (15 @ 37,7), `/` (12 @ 20,8), `/ksiegowosc-spolki-zoo` (6 @ 15,2) | Consolidate or clarify targeting |
| księgi przychodów i rozchodów zduńska wola | 15 | 0 | 0% | 10,0 | `/kpir-ryczalt` (11 @ **5,2**) | Improve existing page |
| kadry i płace zduńska wola | 12 | 0 | 0% | 20,3 | `/kadry-i-place` | Monitor |
| usługi rachunkowe zduńska wola | 11 | 0 | 0% | 11,2 | `/` | Monitor |
| biura rachunkowe zduńska wola | 3 | 0 | 0% | 43,7 | `/` | Monitor |
| motyle zduńska wola | 12 | 0 | 0% | 3,9 | `/` | Ignorować — kolizja nazwy |

## Ustalenia

### 1. `/kpir-ryczalt` — pozycja 5,2 na pierwszej stronie, zero kliknięć

**Dowód:** zapytanie `księgi przychodów i rozchodów zduńska wola`, 11 wyświetleń na `/kpir-ryczalt`, średnia pozycja **5,2**, CTR **0%**.

**Interpretacja:** to nie jest problem rankingu — strona jest na pierwszej stronie wyników. Tytuł brzmiał `KPiR i ryczałt Zduńska Wola – księgowość uproszczona` i zawierał wyłącznie **skrót**, podczas gdy użytkownik wpisuje **pełną frazę**. Snippet nie odzwierciedlał zapytania.

Hipoteza, nie fakt: Google może przepisywać tytuły, więc zmiana jest testem, nie gwarancją.

**Priorytet:** wysoki · **Wpływ:** wzrost kwalifikowanych kliknięć · **Nakład:** mały · **Pewność:** średnia

### 2. Trzy strony konkurują o „księgi rachunkowe zduńska wola", a dedykowana wypada najgorzej

**Dowód:** przy tym samym zapytaniu `/ksiegowosc-spolki-zoo` ma pozycję **15,2**, strona główna **20,8**, a `/pelna-ksiegowosc` — strona stworzona dokładnie pod tę intencję — **37,7**, mimo największej liczby wyświetleń (15).

**Interpretacja:** problem przypisania strony, nie treści. Wszystkie 9 linków wewnętrznych do `/pelna-ksiegowosc` używało kotwicy „Pełna księgowość"; żaden nie zawierał frazy „księgi rachunkowe". Sygnał wewnętrzny nie wskazywał Google, która strona ma tę intencję obsługiwać.

Nie jest to kanibalizacja wymagająca łączenia stron — każda obsługuje inną intencję. Wymaga wyostrzenia sygnałów, nie konsolidacji.

**Priorytet:** wysoki · **Wpływ:** konsolidacja sygnałów na właściwym URL-u · **Nakład:** mały · **Pewność:** średnia

### 3. Fraza główna na pozycji 21,3 — problem autorytetu, nie snippetu

**Dowód:** `biuro rachunkowe zduńska wola`, 47 wyświetleń na `/`, pozycja **21,3**, 4 kliknięcia, CTR **8,5%**.

**Interpretacja:** CTR 8,5% na trzeciej stronie wyników jest **wysoki** — kto zobaczy wynik, ten klika. Ograniczeniem jest pozycja, nie atrakcyjność wyniku. Przepisywanie tytułu leczyłoby niewłaściwą przyczynę. Dźwignie leżą poza repozytorium: wizytówka Google, opinie, spójność NAP, wzmianki zewnętrzne.

**Priorytet:** krytyczny dla biznesu, ale **niewykonalny w repozytorium** · **Pewność:** wysoka

### 4. Mobile rankuje wyraźnie lepiej niż desktop

**Dowód (Polska):** desktop 171 wyświetleń, pozycja **15,2**; mobile 60 wyświetleń, pozycja **5,4**.

**Interpretacja:** hipoteza — wyniki lokalne na mobile silniej faworyzują bliskość. Nie wyciągam wniosku o wadzie wersji desktopowej: próbka jest mała, a różnica może wynikać z układu strony wyników, nie z jakości serwisu.

**Priorytet:** niski, do obserwacji

### 5. Brak wyników rozszerzonych

**Dowód:** zapytanie o wymiar `searchAppearance` zwróciło **zero wierszy**.

**Interpretacja:** żadna strona nie uzyskała jeszcze wzbogaconego wyglądu w wynikach. Serwis ma poprawny `BreadcrumbList` i `FAQPage` na wszystkich podstronach, więc najbardziej prawdopodobne wyjaśnienie to wiek serwisu. Dodatkowo Google od 2023 r. ograniczył wyniki FAQ do witryn rządowych i medycznych — nie należy ich tutaj oczekiwać.

## Ustalenia techniczne i indeksacja

| Sprawdzenie | Status | Szczegóły |
| --- | --- | --- |
| Indeksacja | **Pass** | 7 z 7 stron zaindeksowanych |
| Kanoniczność | Pass | 0 rozbieżności |
| Blokady robots | Pass | 0 |
| Problemy pobierania | Pass | 0 |
| Sitemap | Pass | `sitemap.xml`, zgłoszona 2026-08-27, status `Valid`, 0 błędów, 0 ostrzeżeń, 7 URL-i |

Pole `indexed: 0` w raporcie sitemapy to przestarzały wskaźnik API i **nie zaprzecza** wynikom inspekcji URL, które potwierdzają indeksację wszystkich siedmiu stron.

## Wdrożone teraz

| Zmiana | Plik | Dowód |
| --- | --- | --- |
| Tytuł zawiera pełną frazę „księgi przychodów i rozchodów" obok skrótu KPiR (58 znaków) | `kpir-ryczalt.html` | Ustalenie 1 |
| Link kontekstowy z kotwicą „księgi rachunkowe" → `/pelna-ksiegowosc`, umieszczony na stronie, która obecnie ją przewyższa | `ksiegowosc-spolki-zoo.html` | Ustalenie 2 |

**Poprzedni tytuł:** `KPiR i ryczałt Zduńska Wola – księgowość uproszczona`
**Nowy tytuł:** `KPiR Zduńska Wola – księgi przychodów i rozchodów, ryczałt`

**Weryfikacja:** kotwice linków do `/pelna-ksiegowosc` po zmianie: 9 × „Pełna księgowość" + 1 × „księgi rachunkowe".

### Świadomie niezmienione

`usługi rachunkowe zduńska wola` (pozycja 11,2) — strona główna **już zawiera** nagłówek H2 „Usługi rachunkowe w Zduńskiej Woli". Intencja jest obsłużona, brak luki treściowej. Dopisywanie tekstu wyłącznie pod tę frazę byłoby zmianą bez uzasadnienia w danych.

## Wymaga decyzji lub dostępu

| Działanie | Blokada |
| --- | --- |
| Poprawa pozycji na `biuro rachunkowe zduńska wola` | Poza repozytorium: wizytówka Google, opinie, spójność NAP, wzmianki zewnętrzne |
| `aggregateRating` w danych strukturalnych | Google zabrania „self-serving reviews" dla `LocalBusiness`. Gwiazdki pochodzą z wizytówki, nie z kodu |
| Rozbudowa `/ksef` (577 słów) i `/ksiegowosc-spolki-zoo` (585 słów) | Brak dowodu z Search Console, że objętość ogranicza te strony. Uzasadnione redakcyjnie, nie danymi |
| Publikacja tego raportu | Repozytorium publiczne — wymaga zgody na commit |

## Plan pomiaru

| KPI | Segment | Baza (2026-06-01 → 2026-08-29) | Okno oceny | Reguła decyzyjna |
| --- | --- | --- | --- | --- |
| Kliknięcia i CTR | `księgi przychodów i rozchodów zduńska wola` na `/kpir-ryczalt` | 11 wyśw., 0 klik., CTR 0%, poz. 5,2 | pełne 28 dni po wdrożeniu, koniec okna ≥3 dni przed odczytem | Wsparcie: CTR > 0% przy stabilnej pozycji. Odrzucenie: CTR nadal 0% przy ≥15 wyświetleniach i pozycji ≤8 |
| Pozycja | `księgi rachunkowe zduńska wola` na `/pelna-ksiegowosc` | 15 wyśw., poz. 37,7 | 28 dni po ponownym przecrawlowaniu | Wsparcie: `/pelna-ksiegowosc` wyprzedza `/ksiegowosc-spolki-zoo`. Niejednoznaczne: kolejność bez zmian przy <20 wyświetleniach |
| Kliknięcia | `biuro rachunkowe zduńska wola` na `/` | 47 wyśw., 4 klik., poz. 21,3 | 28 dni po działaniach wokół wizytówki | Wsparcie: pozycja poniżej 15 |

## Backlog eksperymentów

| Eksperyment | Strona | Baza | Zmiana | Oczekiwany efekt | Ponowny audyt | Reguła decyzyjna |
| --- | --- | --- | --- | --- | --- | --- |
| E1 — pełna fraza w tytule | `/kpir-ryczalt` | `księgi przychodów i rozchodów zduńska wola`: 11 wyśw., 0 klik., poz. 5,2 (2026-06-01 → 2026-08-29) | Tytuł w `kpir-ryczalt.html` — **wdrożone** | CTR > 0% przy stabilnej pozycji | 28 dni po wdrożeniu | Odrzucenie, jeśli CTR = 0% przy ≥15 wyśw. i poz. ≤8 |
| E2 — kotwica opisowa | `/pelna-ksiegowosc` | `księgi rachunkowe zduńska wola`: 15 wyśw., poz. 37,7 | Link z `ksiegowosc-spolki-zoo.html` — **wdrożone** | `/pelna-ksiegowosc` wyprzedza siostrzane strony | 28 dni po przecrawlowaniu | Niejednoznaczne przy <20 wyśw. |
| E3 — wizytówka i opinie | `/` | `biuro rachunkowe zduńska wola`: 47 wyśw., 4 klik., poz. 21,3 | Poza repozytorium | Pozycja < 15 | 28 dni po działaniach | Odrzucenie, jeśli pozycja bez zmian przy ≥100 wyśw. |

Eksperymenty E1 i E2 dotyczą różnych zapytań i różnych stron, więc ich efekty da się rozdzielić.

## Ograniczenia danych

- Serwis ma **trzy tygodnie danych**. Brak porównania okres-do-okresu i rok-do-roku. Wszystkie odsetki liczone na małych próbkach są niestabilne.
- `pagination.coverage.complete_dataset: false` — Google zwraca wiersze najwyższe, nie wszystkie. Zapytania rzadkie i wrażliwe są pomijane.
- Średnia pozycja to średnia najwyższego wyniku witryny, nie pozycja z rank-trackera.
- Search Console mierzy widoczność i kliknięcia, **nie** wartość biznesową. Brak podłączonych danych o konwersjach.
- Inspekcja zbiorcza (`batch_url_inspection`) zwróciła błąd aplikacji po stronie usługi; użyto `check_indexing_issues` w dwóch partiach.
- Zmiany wdrożone 2026-09-01 **nie są jeszcze opublikowane** — leżą w repozytorium lokalnie. Okno pomiaru liczy się od daty wdrożenia na produkcję, nie od daty audytu.
