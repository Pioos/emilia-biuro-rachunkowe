# Zadanie: tygodniowa migawka historii Search Console

Zadanie **wyłącznie rejestrujące**. Nie wdraża zmian SEO, nie commituje, nie publikuje i nie rozstrzyga eksperymentów — od tego jest `docs/seo/search-console-re-audit.md`.

## Kontekst stały

- **Właściwość Search Console:** `https://biuro-motylska.pl/` (uprawnienie `siteOwner`)
  - Nie używaj `sc-domain:biuro-motylska.pl` — brak dostępu do danych.
- **Typ wyszukiwania:** `web` · **data_state:** `all`
- **Cel biznesowy:** kwalifikowane zapytania od przedsiębiorców ze Zduńskiej Woli i okolic
- **Katalog roboczy:** `C:\Users\Piotr\Desktop\projekty\Emilia biuro rachunkowe`
- **Tryb poufności:** repozytorium jest **publiczne**. Zapisuj dokładne zapytania i strony tylko dlatego, że są to ogólne frazy branżowe bez danych osobowych. Jeśli pojawi się zapytanie mogące identyfikować osobę lub klienta — pomiń je i odnotuj pominięcie.

## Previous snapshot

```
none
```

Aktualizuj to pole **dopiero po** zapisaniu i zweryfikowaniu nowej migawki.

## Harmonogram

- **Cykl:** co tydzień, poniedziałek
- **Godzina:** 09:00, strefa `Europe/Warsaw`
- **Stabilność:** okno 7-dniowe musi kończyć się przed `first_incomplete_date`, w praktyce co najmniej 3 dni przed uruchomieniem.

## Okna do pobrania

| Okno | Definicja |
| --- | --- |
| Bieżące 7 dni | stabilne, kończące się ≥3 dni przed uruchomieniem |
| Poprzednie 7 dni | bezpośrednio poprzedzające powyższe |
| Bieżące 28 dni | stabilne |
| Poprzednie 28 dni | bezpośrednio poprzedzające |
| Rok wcześniej 28 dni | te same daty rok wcześniej, jeśli istnieją dane |

Stosuj te same definicje przy **każdym** uruchomieniu.

## Przebieg

1. Ustal stabilny punkt odcięcia przez `get_seo_audit_baseline`; potwierdź `data_quality.stable_window` i odczytaj `first_incomplete_date`.
2. Pobierz sumy dla wszystkich okien z tabeli powyżej.
3. Pobierz dzienny trend dla stabilnego okna 7-dniowego.
4. Pobierz ograniczone zestawy stron i zapytań (`fetch_all=true`, rozsądny `max_rows`) i zanotuj `pagination.coverage`.
5. Pobierz podsumowania po `device` i `country`. `searchAppearance` pobierz **osobnym zapytaniem** — Google wymaga, by był jedynym wymiarem.
6. Wylicz największe bezwzględne zyski i straty kliknięć względem poprzedniego okna 7-dniowego.
7. Zapisz migawkę pod `docs/seo/search-console-history/search-console-weekly-WINDOW-END.md`, gdzie `WINDOW-END` to ostatni dzień stabilnego okna 7-dniowego.
8. Zaktualizuj indeks `docs/seo/search-console-history/README.md` — najnowsze u góry.
9. Zaktualizuj pole **Previous snapshot** w tym pliku.

## Zawartość migawki

1. Znacznik czasu zebrania, strefa, właściwość, cel biznesowy, typ wyszukiwania, `data_state`, `first_incomplete_date`, dokładny punkt odcięcia.
2. Sumy dla bieżącego i poprzedniego okna 7-dniowego: kliknięcia, wyświetlenia, CTR, średnia pozycja — ze zmianą bezwzględną i procentową tam, gdzie ma to sens matematyczny.
3. Sumy dla okien 28-dniowych: bieżącego, poprzedniego i rok wcześniej, jeśli dane istnieją.
4. Tabela trendu dziennego dla stabilnego okna 7-dniowego.
5. Najlepsze strony i zapytania oraz największe bezwzględne zyski i straty kliknięć.
6. Podsumowania po urządzeniu, kraju i wyglądzie w wynikach.
7. Zwięzłe porównanie z dokładną poprzednią migawką, z oznaczeniem istotnych ruchów. **Bez twierdzeń o przyczynach.**
8. Zasięg paginacji, pominięte lub zanonimizowane zapytania, opóźnienie danych, ograniczenia API oraz informacja, czy plik jest pełny czy zredagowany.
9. Odnośniki do poprzedniej migawki i do najnowszego raportu audytu.

## Filtrowanie szumu

Przy opisie zapytań oznacz osobno:

- zapytania zawierające operatory `-site:` — ruch narzędzi automatycznych, nie użytkowników;
- `motyle zduńska wola` — kolizja nazwiska „Motylska" z owadami, zapytanie bez wartości biznesowej.

Nie usuwaj ich z surowych sum, ale wyklucz je z wniosków o CTR i szansach.

## Zasady

- **Nigdy nie nadpisuj istniejącej migawki.** Jeśli plik docelowy już istnieje, sprawdź, czy to okno zostało już zapisane, i zgłoś duplikat zamiast podmieniać historię.
- Nie twórz pustej ani częściowej migawki po błędzie API. Zgłoś błąd i zakończ.
- Nie wdrażaj zmian SEO, nie commituj, nie wypychaj i nie publikuj w ramach tego zadania, chyba że zostanie to osobno zlecone.
- Migawki Markdown to **streszczenia historyczne, nie kompletny eksport danych**. Search Console pomija zapytania rzadkie i wrażliwe, zwraca wiersze najwyższe zamiast pełnego zbioru i ma ograniczony okres retencji. Jeśli potrzebne jest kompletne przechowywanie na poziomie wierszy — właściwym narzędziem jest baza danych lub eksport zbiorczy Search Console.
