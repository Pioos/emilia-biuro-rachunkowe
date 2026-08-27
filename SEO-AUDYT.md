# Audyt SEO — Biuro Rachunkowe Emilia Motylska

Data audytu: 27 sierpnia 2026 r.
Domena: https://biuro-motylska.pl/

## Wniosek

Serwis ma poprawną bazę on-page: unikalne tytuły i opisy, jeden H1 na stronę, canonicale, rozbudowane dane Schema.org, czytelne adresy URL i linkowanie pomiędzy usługami. Największym ograniczeniem widoczności lokalnej nie jest obecnie brak treści na stronie, lecz niespójny adres firmy w zewnętrznych źródłach oraz niewielka liczba widocznych w wynikach Google podstron domeny.

## P0 — najpilniejsze

1. Ustalić jeden aktualny NAP:
   - nazwa: `Biuro Rachunkowe Emilia Motylska`,
   - adres na stronie: `ul. Ignacego Jana Paderewskiego 3A, 98-220 Zduńska Wola`,
   - telefon: `+48 786 333 003`.
2. Potwierdzić, że ten sam adres widnieje w Google Business Profile.
3. Zaktualizować stare cytowania firmy. W wynikach wyszukiwania Panorama Firm, GoWork i Targeo nadal pokazują `ul. Wieniawskiego 5/20`; Oferteo miesza adres rejestrowy i adres jednostki lokalnej.
4. Po wdrożeniu zmian przesłać ponownie `https://biuro-motylska.pl/sitemap.xml` w Google Search Console i poprosić o indeksację siedmiu adresów sprzedażowych.

## P1 — wdrożone w kodzie

- jawne `index, follow` wraz z pełnymi podglądami snippetów na stronie głównej i stronach usług,
- self-referencing `hreflang="pl"` na stronach przeznaczonych do indeksowania,
- poprawny `og:type="website"` dla stron usług zamiast typu artykułu,
- `noindex, follow` dla dokumentów prawnych,
- usunięcie dokumentów `noindex` z mapy witryny,
- aktualizacja prawdziwej daty modyfikacji stron w `sitemap.xml`,
- przypisanie odrębnych klastrów fraz do strony głównej, pełnej księgowości, KPiR i ryczałtu, obsługi kadrowo-płacowej oraz VAT i JPK,
- opisowe anchory zamiast ogólnych odnośników „Dowiedz się więcej”,
- dwie unikalne landing pages: `/ksef` i `/ksiegowosc-spolki-zoo`,
- dane `Service`, `BreadcrumbList` i `FAQPage` dla nowych landing pages,
- linkowanie z istniejących stron, stopki i strony głównej do nowych usług,
- przekierowania 301 z nowych adresów zakończonych `.html`,
- poprawiony układ statystyk w hero na ekranach mobilnych.

## P1 — działania poza kodem

- Google Business Profile: właściwa kategoria główna odpowiadająca biuru rachunkowemu, komplet usług, godziny, adres i telefon zgodne ze stroną.
- Minimum 10 aktualnych zdjęć: fasada, wejście, wnętrze, zespół, certyfikat; później 1–2 nowe zdjęcia tygodniowo.
- Regularne pozyskiwanie prawdziwych opinii Google po zakończonej obsłudze lub ważnym etapie współpracy; bez rabatów za opinię.
- Odpowiedź na każdą opinię i uzupełnienie co najmniej pięciu realnych pytań i odpowiedzi w profilu.
- Aktualizacja cytowań w kolejności: Google Business Profile, Aleo, Panorama Firm, Oferteo, pkt.pl, GoWork i Targeo.

## P2 — dalszy rozwój treści

- Nie tworzyć seryjnych kopii strony dla Sieradza, Łasku, Szadku i innych miast. Lokalna podstrona ma sens tylko wtedy, gdy zawiera unikalne informacje, dowody obsługi danego obszaru i własne FAQ.
- Rozbudować serwis o poradniki odpowiadające na rzeczywiste pytania klientów, np. zmiana biura rachunkowego, wybór KPiR lub ryczałtu i przygotowanie firmy do KSeF. Każdy poradnik powinien linkować do właściwej usługi.
- Zweryfikować zapytania i strony w Google Search Console po 28 i 90 dniach. Decyzje o nowych treściach podejmować na podstawie wyświetleń, średniej pozycji i CTR, nie samej liczby fraz.

## Pozostałe kwestie techniczne

- Publiczne adresy strony głównej i `/pelna-ksiegowosc` zwracają `200 OK`; mapa witryny również zwraca `200 OK`.
- HTTPS, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` i `Permissions-Policy` są obecne.
- Brakuje nagłówka Content Security Policy. Należy wdrażać go osobno, po przygotowaniu allowlisty dla Google Fonts, Google Maps i Google Analytics, aby nie uszkodzić formularza ani analityki.
- Obraz Open Graph `outside.jpg` ma 900×1200 px. Warto przygotować dedykowany obraz 1200×630 px, poniżej 300 KB, z bezpiecznym kadrem do udostępnień na Facebooku i LinkedIn.

## Kryteria kontroli po wdrożeniu

- dokładnie jeden H1 na każdej stronie,
- unikalne tytuły i opisy,
- zgodność canonical, hreflang, sitemap i robots,
- prawidłowy JSON-LD bez błędów składni,
- brak stron `noindex` w sitemapie,
- jeden identyczny NAP na stronie, w GBP i katalogach,
- Core Web Vitals: LCP poniżej 2,5 s, INP poniżej 200 ms, CLS poniżej 0,1.
