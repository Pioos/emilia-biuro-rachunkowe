# Zadanie: ponowny audyt Search Console

Instrukcja dla powtarzalnego uruchomienia. Nie jest to raport — raporty powstają w `docs/seo/search-console-audit-YYYY-MM-DD.md`.

## Kontekst stały

- **Właściwość Search Console:** `https://biuro-motylska.pl/` (uprawnienie `siteOwner`)
  - Nie używaj `sc-domain:biuro-motylska.pl` — ma uprawnienie `siteUnverifiedUser` i nie zwraca danych.
- **Typ wyszukiwania:** `web` · **data_state:** `all`
- **Cel biznesowy:** kwalifikowane zapytania od przedsiębiorców ze Zduńskiej Woli i okolic — telefon, e-mail, formularz kontaktowy. Nie optymalizuj średniej pozycji jako celu samego w sobie.
- **Katalog roboczy:** repozytorium `emilia-biuro-rachunkowe`, branch `master`.
- **Repozytorium jest publiczne** — nie zapisuj poświadczeń, tokenów ani danych mogących identyfikować klientów.

## Previous audit

```
docs/seo/search-console-audit-2026-10-14.md
```

**Przeczytaj ten plik przed odpytaniem Search Console.** Jeśli nie istnieje — zatrzymaj się i zgłoś dokładną brakującą ścieżkę. Nie uruchamiaj porównania bez zakotwiczenia w poprzednim raporcie.

## Co zostało wdrożone w poprzednim audycie

- **Data wdrożenia do repozytorium:** 2026-10-14 (audyt), dodatkowe poprawki 2026-10-20
- **Data publikacji na produkcję:** 2026-10-20 (scalone do `master`, commit `7a38886`)

| Plik | Zmiana |
| --- | --- |
| `index.html` | Nowy link kontekstowy w FAQ "Kiedy trzeba przejść na pełną księgowość?" → `/pelna-ksiegowosc`, kotwica "pełną księgowość" |
| `vat-jpk.html` | Nowe zdanie łączące ewidencję VAT z pełnymi księgami rachunkowymi → `/pelna-ksiegowosc`, kotwica "pełne księgi rachunkowe" |
| `kadry-i-place.html` | Nowe zdanie łączące listy płac z pełnymi księgami rachunkowymi → `/pelna-ksiegowosc`, kotwica "pełne księgi rachunkowe" |

Poprawki #1 (zapaść CTR na mobile na stronie głównej), #3 (świadome nic-nie-rób na `/kpir-ryczalt`), #4 (wizytówka Google/opinie, poza repo) i #5 (monitoring nowych zapytań) z audytu 2026-10-14 **nie zostały wdrożone** — patrz raport po szczegóły.

## Eksperymenty do rozstrzygnięcia

| ID | Segment | Baza (2026-09-14 → 2026-10-11) | KPI | Reguła decyzyjna | Status |
| --- | --- | --- | --- | --- | --- |
| E1 | `księgi przychodów i rozchodów zduńska wola` na `/kpir-ryczalt` | 17 wyśw., 0 klik., CTR 0%, poz. 3,8 | CTR i kliknięcia | — | **ZAMKNIĘTY: ODRZUCONY** (audyt 2026-10-14) — nie testować dalej na tej stronie bez nowych danych |
| E2 | `księgi rachunkowe zduńska wola` na `/pelna-ksiegowosc` | 10 wyśw., poz. 24 (siostrzane: `/ksiegowosc-spolki-zoo` 12,5, `/` 28,5) | Pozycja względna | **Wsparcie:** `/pelna-ksiegowosc` wyprzedza obie strony siostrzane. **Niejednoznaczne:** <20 wyśw. | **OTWARTY, zasilony nowymi linkami 2026-10-20** — oceń od 2026-11-17 |
| E3 | `biuro rachunkowe zduńska wola` na `/` | 75 wyśw., 1 klik., CTR 1,33%, poz. 8,9 | Pozycja | Poz. < 15 | **ZAMKNIĘTY: WSPARTY** (pozycja) — ale kliknięcia/CTR na tej frazie pogorszyły się, patrz E4 |
| E4 | Mobile, strona `/` | 0 klik., 52 wyśw., CTR 0%, poz. 7,7 (2026-09-14→10-11) | CTR mobile | **Odrzucenie:** CTR nadal 0% przy ≥50 wyśw. i poz. ≤10 po dwóch kolejnych oknach | **OTWARTY** — wymaga ręcznej inspekcji żywego renderowania mobile (środowisko audytu nie ma dostępu do domeny) |

## Harmonogram

- **Pierwsze faktyczne uruchomienie przez automatyzację:** 2026-11-17 (28 dni od publikacji poprawki #2 na produkcję, 2026-10-20)
- **Cykl:** co 28 dni od tej daty
- **Godzina:** 09:00, strefa `Europe/Warsaw`
- **Wymóg stabilności danych:** okno musi kończyć się przed `first_incomplete_date`, w praktyce co najmniej 3 dni przed uruchomieniem. Użyj `get_seo_audit_baseline` i potwierdź `data_quality.stable_window`.
- **Uwaga dla przyszłego przebiegu:** po zakończeniu audytu i ewentualnym wdrożeniu poprawek, zaplanuj kolejne uruchomienie za 28 dni od **daty publikacji na produkcję**, nie od daty samego audytu — scalanie do `master` i wdrożenie bywają opóźnione względem napisania raportu (tak jak tutaj: audyt 2026-10-14, wdrożenie 2026-10-20).

## Przebieg

1. Przeczytaj raport wskazany w **Previous audit**. Wypisz jego okna, metryki, ustalenia i status eksperymentów.
2. Przeczytaj playbook: `searchconsole://guides/seo-analysis-playbook`.
3. Odpytaj Search Console tą samą właściwością, typem wyszukiwania, `data_state` i definicjami okien. Każdą wymuszoną zmianę metodologii opisz jawnie.
4. Pobierz dane pogrupowane po: `query`, `page,query`, `device`, `country` oraz osobno `searchAppearance` (Google wymaga, by był jedynym wymiarem). Używaj `fetch_all=true` z rozsądnym `max_rows` i sprawdź `pagination.coverage`.
5. **Odfiltruj szum przed analizą CTR:**
   - zapytania zawierające operatory `-site:` to ruch narzędzi automatycznych, nie użytkowników;
   - `motyle zduńska wola` to kolizja nazwiska z owadami — nigdy nie skonwertuje.
6. Sprawdź indeksację (`check_indexing_issues`, partiami do 3–4 URL-i, bo `batch_url_inspection` bywa niestabilne) oraz stan sitemapy.
7. Porównaj z poprzednim audytem i **oznacz każdą pozycję etykietą**: `poprawa`, `pogorszenie`, `bez zmian`, `niejednoznaczne`. Rozstrzygnij otwarte eksperymenty (E2, E4) według reguł powyżej.
8. Wdróż bezpieczne, poparte dowodami zmiany w repozytorium **tylko po akceptacji użytkownika** — ten re-audyt sam w sobie nie jest automatycznym przyzwoleniem na zmiany w kodzie, chyba że sesja wywołująca go otrzymała wyraźne `execute_now`.
9. Zapisz nowy raport `docs/seo/search-console-audit-YYYY-MM-DD.md` z bieżącą datą.
10. **Zaktualizuj pole `Previous audit` w tym pliku** na ścieżkę nowego, zweryfikowanego raportu, oraz pole **Harmonogram** o datę kolejnego uruchomienia liczoną od faktycznej daty wdrożenia na produkcję.

## Zasady

- Zadanie musi zebrać **świeże dane z Search Console**. Nie porównuj samych plików Markdown.
- Odróżniaj fakty od hipotez. Nie opisuj korelacji jako przyczyny.
- Szereguj straty według bezwzględnej liczby kliknięć, nie procentów.
- Nie twórz planu dzień po dniu ani 30-dniowego harmonogramu wdrożeń.
- Zapytaj przed wdrożeniem na produkcję, publikacją, zmianami destrukcyjnymi i mutacjami systemów zewnętrznych.
- Nie twierdź, że SearchConsole.ai cokolwiek zmieniło — dostęp jest wyłącznie do odczytu.
- Nie twórz ponownie `docs/seo/search-console-weekly-history.md` ani harmonogramu cotygodniowych migawek — ta funkcja była świadomie odrzucona dwukrotnie (usunięta 2026-09-01, potwierdzona odmowa 2026-10-20). Jeśli użytkownik poprosi o nią ponownie w przyszłości, potraktuj to jako nową, wyraźną decyzję i zapytaj wprost, zanim ją odtworzysz.
