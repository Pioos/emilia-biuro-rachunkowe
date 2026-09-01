# Zadanie: ponowny audyt Search Console

Instrukcja dla powtarzalnego uruchomienia. Nie jest to raport — raporty powstają w `docs/seo/search-console-audit-YYYY-MM-DD.md`.

## Kontekst stały

- **Właściwość Search Console:** `https://biuro-motylska.pl/` (uprawnienie `siteOwner`)
  - Nie używaj `sc-domain:biuro-motylska.pl` — ma uprawnienie `siteUnverifiedUser` i nie zwraca danych.
- **Typ wyszukiwania:** `web` · **data_state:** `all`
- **Cel biznesowy:** kwalifikowane zapytania od przedsiębiorców ze Zduńskiej Woli i okolic — telefon, e-mail, formularz kontaktowy. Nie optymalizuj średniej pozycji jako celu samego w sobie.
- **Katalog roboczy:** `C:\Users\Piotr\Desktop\projekty\Emilia biuro rachunkowe`
- **Repozytorium jest publiczne** — nie zapisuj poświadczeń, tokenów ani danych mogących identyfikować klientów.

## Previous audit

```
docs/seo/search-console-audit-2026-09-01.md
```

**Przeczytaj ten plik przed odpytaniem Search Console.** Jeśli nie istnieje — zatrzymaj się i zgłoś dokładną brakującą ścieżkę. Nie uruchamiaj porównania bez zakotwiczenia w poprzednim raporcie.

## Co zostało wdrożone w poprzednim audycie

- **Data wdrożenia do repozytorium:** 2026-09-01
- **Data publikacji na produkcję:** 2026-09-01

| Plik | Zmiana |
| --- | --- |
| `kpir-ryczalt.html` | Tytuł: `KPiR i ryczałt Zduńska Wola – księgowość uproszczona` → `KPiR Zduńska Wola – księgi przychodów i rozchodów, ryczałt` |
| `ksiegowosc-spolki-zoo.html` | Link kontekstowy z kotwicą „księgi rachunkowe" → `/pelna-ksiegowosc` |

## Eksperymenty do rozstrzygnięcia

| ID | Segment | Baza (2026-06-01 → 2026-08-29) | KPI | Reguła decyzyjna |
| --- | --- | --- | --- | --- |
| E1 | `księgi przychodów i rozchodów zduńska wola` na `/kpir-ryczalt` | 11 wyśw., 0 klik., CTR 0%, poz. 5,2 | CTR i kliknięcia | **Wsparcie:** CTR > 0% przy stabilnej pozycji. **Odrzucenie:** CTR = 0% przy ≥15 wyśw. i poz. ≤8. **Niejednoznaczne:** <15 wyśw. |
| E2 | `księgi rachunkowe zduńska wola` na `/pelna-ksiegowosc` | 15 wyśw., poz. 37,7 (siostrzane: `/ksiegowosc-spolki-zoo` 15,2, `/` 20,8) | Pozycja względna | **Wsparcie:** `/pelna-ksiegowosc` wyprzedza obie siostrzane strony. **Niejednoznaczne:** <20 wyśw. |
| E3 | `biuro rachunkowe zduńska wola` na `/` | 47 wyśw., 4 klik., CTR 8,5%, poz. 21,3 | Pozycja | **Wsparcie:** poz. < 15. **Odrzucenie:** bez zmian przy ≥100 wyśw. Zmiana leży poza repozytorium (wizytówka, opinie, NAP) |

## Harmonogram

- **Pierwsze uruchomienie:** 2026-09-29
- **Cykl:** co 28 dni
- **Godzina:** 09:00, strefa `Europe/Warsaw`
- **Wymóg stabilności danych:** okno musi kończyć się przed `first_incomplete_date`, w praktyce co najmniej 3 dni przed uruchomieniem. Użyj `get_seo_audit_baseline` i potwierdź `data_quality.stable_window`.

## Przebieg

1. Przeczytaj raport wskazany w **Previous audit**. Wypisz jego okna, metryki, ustalenia i status eksperymentów.
2. Przeczytaj playbook: `searchconsole://guides/seo-analysis-playbook`.
3. Odpytaj Search Console tą samą właściwością, typem wyszukiwania, `data_state` i definicjami okien. Każdą wymuszoną zmianę metodologii opisz jawnie.
4. Pobierz dane pogrupowane po: `query`, `page,query`, `device`, `country` oraz osobno `searchAppearance` (Google wymaga, by był jedynym wymiarem). Używaj `fetch_all=true` z rozsądnym `max_rows` i sprawdź `pagination.coverage`.
5. **Odfiltruj szum przed analizą CTR:**
   - zapytania zawierające operatory `-site:` to ruch narzędzi automatycznych, nie użytkowników;
   - `motyle zduńska wola` to kolizja nazwiska z owadami — nigdy nie skonwertuje.
6. Sprawdź indeksację (`check_indexing_issues`, partiami do 3–4 URL-i, bo `batch_url_inspection` bywa niestabilne) oraz stan sitemapy.
7. Porównaj z poprzednim audytem i **oznacz każdą pozycję etykietą**: `poprawa`, `pogorszenie`, `bez zmian`, `niejednoznaczne`. Rozstrzygnij E1, E2 i E3 według reguł powyżej.
8. Wdroż bezpieczne, poparte dowodami zmiany w repozytorium. Nie odkładaj pracy, którą da się wykonać teraz.
9. Zapisz nowy raport `docs/seo/search-console-audit-YYYY-MM-DD.md` z bieżącą datą.
10. **Zaktualizuj pole `Previous audit` w tym pliku** na ścieżkę nowego, zweryfikowanego raportu.

## Zasady

- Zadanie musi zebrać **świeże dane z Search Console**. Nie porównuj samych plików Markdown.
- Odróżniaj fakty od hipotez. Nie opisuj korelacji jako przyczyny.
- Szereguj straty według bezwzględnej liczby kliknięć, nie procentów.
- Nie twórz planu dzień po dniu ani 30-dniowego harmonogramu wdrożeń.
- Zapytaj przed wdrożeniem na produkcję, publikacją, zmianami destrukcyjnymi i mutacjami systemów zewnętrznych.
- Nie twierdź, że SearchConsole.ai cokolwiek zmieniło — dostęp jest wyłącznie do odczytu.
