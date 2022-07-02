# nodesuba

## Jak odpalicz?
Proces kucowniczy oprzemy na dockerze, żeby każdy mógł odpalić środowisko jedną komendą. Wpisujemy:
```
docker-compose up
```
I możemy bzikać. W przypadku backendu wchodzimy na `http://localhost:4000/docs` i się bawimy. Jest tam jakiś hot reload, więc jak coś zmienimy w kodzie to nasz docker też się odświeży bez żadnego pierdolenia.

Żadnych envów jeszcze konfigurować nie trzeba, bo wrzuciłem domyślne. 

## Backlog
### Co już jest?
#### Backend
* listowanie desek (jest tam załadowany seed, który tworzy pierwszą deskę `/b/ - Random`)
* tworzenie fredów i odpowiadanie na nie,
* bany po IP
#### Frontend 
* nic xD

### Co już jest zaczęte i czeka na dokończenie
* handlowanie backlinków
* bany na zakres

### Co trzeba zacząć robić
* formatowanie wiadomości (słowofiltry itp.)
* frontend
* spięcie frontendu z backiem w jakiś zgrabny sposób
* upload obrazków i generowanie miniaturek
* panel modkowy

## Środowisko devowe
Backend był robiony w VS Code z pluginami:
* JavaScript and TypeScript Nightly
* Markdown All in One
* Prettier - Code formatter (klikasz `Ctrl+Shift+I` i ci formatuje kod)
* Prisma