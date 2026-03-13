<div align="center">
  <img src="https://camo.githubusercontent.com/bf050070084e592919e524ab012ead1806dd6ba6451ccc756f2bb0464b99dc9a/68747470733a2f2f6b61746f6c696b75736b6572692e68752f46696c65732f6b6572692f6b6572695f6c6f676f322e6a7067" alt="ClanVerse Logo" width="200"/>
  <h1>Szent István Katolikus Technikum és Gimnázium</h1>
  <h2>
    Bódisz Loránd<br>
    Sedlák Ákos<br>
    Simkó Roland
  </h2>
  <h1>ClanVerse</h1>
  <h2>Szoftverfejlesztés és -tesztelés vizsgaremek</h2>
  <h4>Sátoraljaújhely, 2026</h4>
</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22+-green" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.1.0-blue" alt="Express" />
  <img src="https://img.shields.io/badge/Angular-20.3-red" alt="Angular" />
  <img src="https://img.shields.io/badge/MariaDB-3.4.5-orange" alt="MariaDB" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3.8-purple" alt="Bootstrap" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-ISC-yellow.svg" alt="License: ISC" />
</p>

---

## 📋 Tartalomjegyzék

- [Projekt leírása](#-projekt-leírása)
- [Rendszerkövetelmények](#-rendszerkövetelmények)
- [Fejlesztéshez használt szoftverek és eszközök](#️-fejlesztéshez-használt-szoftverek-és-eszközök)
- [Telepítés és elindítás](#-telepítés-és-elindítás)
- [Backend API Dokumentáció](#-backend-api-dokumentáció)
- [Projekt Szerkezete](#-projekt-szerkezete)
- [Munkamenet és szervezés](#-munkamenet-és-szervezés)

---

## 🎮 Projekt leírása

A **ClanVerse** egy webalapú közösségi platform, amellyel gamer közösségeket építhetsz és menedzselhetsz. A projekt célja, hogy egyszerűvé tegye a klánalapítást, a csatlakozást és a csapattagok közötti folyamatos interakciót.


### ✨ Főbb Funkciók:
- **Felhasználói fiókok kezelése** - Regisztráció, bejelentkezés, profil szerkesztés
- **Klánok menedzselése** - Klánok létrehozása, módosítása, törlése
- **Klántársaság** - Csatlakozás klánokhoz, kilépés és kizárás a klánból
- **Chat** - Klántagok közötti üzenetváltás
- **Játékok** - Játékadat-kezelés és ranglisták
- **Admin panel** - Adminisztratív funkciók (háttér funkció) és játékfeltöltés

---

## 💻 Rendszerkövetelmények

### Minimális követelmények:
- **Operációs rendszer:** Windows 10, macOS 10.15, Linux (Ubuntu 20.04 vagy újabb)
- **Memória:** 2 GB RAM
- **Tárhely:** 500 MB szabad hely
- **Node.js:** 22.3.0 vagy újabb
- **npm/yarn:** 10.0.0 vagy újabb

### Ajánlott követelmények:
- **Operációs rendszer:** Windows 11, macOS 12 vagy újabb, Linux (Ubuntu 22.04)
- **Memória:** 4 GB RAM vagy több
- **Tárhely:** 1 GB szabad hely
- **Node.js:** 22.19.0 vagy újabb
- **npm/yarn:** 11.8.0 vagy újabb

---

## 🛠️ Fejlesztéshez használt szoftverek és eszközök

### Backend Technológiák:
| Technológia | Verzió | Felhasználás |
|---|---|---|
| **Node.js** | 22+ | JavaScript runtime environment |
| **Express.js** | 5.1.0 | Web keretrendszer |
| **MariaDB** | 3.4.5+ | Adatbázis szerver |
| **Sequelize** | 6.37.7 | ORM (Object-Relational Mapping) |
| **JWT (JSON Web Tokens)** | 9.0.2 | Autentikáció és autorizáció |
| **bcrypt** | 6.0.0 | Jelszótitkosítás |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Multer** | 2.0.2 | Fájlfeltöltés kezelés |
| **dotenv** | 17.2.3 | Környezeti változók kezelése |
| **Nodemon** | 3.1.10 | Fejlesztői szerverautomatizálás |

### Frontend Technológiák:
| Technológia | Verzió | Felhasználás |
|---|---|---|
| **Angular** | 20.3 | Frontend keretrendszer |
| **TypeScript** | 5.9.2 | Tipizált JavaScript |
| **Bootstrap** | 5.3.8 | CSS keretrendszer |
| **RxJS** | 7.8.0 | Reaktív programozás |
| **Angular CLI** | 20.3.1 | Angular fejlesztői eszközök |
| **Karma** | 6.4.0 | Tesztkészítő |
| **Jasmine** | 5.9.0 | Tesztkeret |

### Fejlesztői Eszközök:
| Eszköz | Verzió | Felhasználás |
|---|---|---|
| **Visual Studio Code** | Legújabb | Kódszerkesztő |
| **Git** | 2.40+ | Verziókezelés |
| **GitHub Desktop** | Legújabb | Git grafikus felület |
| **Figma** | Online | UI/UX tervezés |
| **Postman** | Legújabb | API tesztelés |
| **XAMPP** | 8.2+ | Adatbázis-kezelés |

### Visual Studio Code Bővítmények (ajánlott):
| Bővítmény neve | Kiadó | VSC azonosító | Magyarázat |
|---|---|---|---|
| **ERD Editor** | dineug | dineug.vuerd-vscode| Táblák közötti kapcsolatok vizualizálása (Adatbázisterv) |
| **Material Icon Theme** | Philipp Kief | pkief.material-icon-theme | Mappa és ikon téma a könnyebb átláthatóságért |
| **Better Comments** | Aaron Bond | aaron-bond.better-comments | Egyedi stílusú kommentek (pl. Piros betűszín, ha "!" van előtte) |
| **Angular Language Service** | Angular | angular.ng-template | Intelligens kódkiegészítés, hibaellenőrzés és navigáció az Angular sablonokhoz |

---

## 🚀 Telepítés és elindítás

### 1. Előfeltételek
Győződj meg róla, hogy telepítve van:
- [Node.js](https://nodejs.org/) (22.0.0 vagy újabb)
- [XAMPP](https://www.apachefriends.org/hu/index.html) (8.2 vagy újabb)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Github Desktop](https://desktop.github.com/download/) vagy [Github oldal](https://github.com/)

### 2. Projekt klónozása
Két módon lehet ezt megtenni:
#### a) Github oldalról klónozás
Nyitsd meg Githubon a [ClanVerseProjekt_BodiszSedlakSimko](https://github.com/KhAkosYT/ClanVerseProjekt_BodiszSedlakSimko) repository-t. Nyomj a **zöld *Code*** gombra, majd kattints a "download ZIP"-re. A letöltött tömörített mappát csomagold ki valahova (legegyszerűbb az asztalra)
#### b) Github Desktop-ból
Itt is 2 módszerrel lehet klónozni:
- vagy a Web-es letöltést követve, csak a "download ZIP" gomb helyett "open with Github Desktop" gombra kell kattintani.
- vagy a Github desktop alkalmazáson belül a "clone a repository from the Internet" gombra kell kattintani. A felugró ablaknál kattints az **URL** gombra és illeszd be a repository url-jét (https://github.com/KhAkosYT/ClanVerseProjekt_BodiszSedlakSimko).

> [!IMPORTANT]
> Ha telepítve van, nyitsd meg a mappát a Visual Studio Code-ban.

### 3. Backend Beállítása

#### a) Függőségek telepítése
***Ctrl + Shift + ö*** paranccsal nyiss egy terminal-t.
Írd be a következő parancsokat a terminal-ba:
```bash
cd backend
npm install
```
> [!NOTE]
> Ha az alábbi hibát kapod, nem kell megijedni, csak a VSC alapértelmezett terminal-ja a PowerShell.
```diff
- npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Polic
- ies at https:/go.microsoft.com/fwlink/?LinkID=135170.
- At line:1 char:1
- + npm i
- + ~~~
-    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
-    + FullyQualifiedErrorId : UnauthorizedAccess
```
Ezt a hibát 2 módon tudod orvosolni: <br/>
**1) átváltod** a terminal-t **powershell**-ről **cmd**-re (Command Prompt): ebben az esetben ismét be kell lépned a backend mappába.
```bash
cd backend
npm install
```
**2) beilleszted** az alábbi kódot a terminalba:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
ha ezt beillesztetted, ismét beírhatod az ```npm install``` parancsot.


#### b) Környezeti változók beállítása
a backend mappán belül van egy [.env.example](https://github.com/KhAkosYT/ClanVerseProjekt_BodiszSedlakSimko/blob/main/backend/.env.example) fájl. Vagy átnevezed ezt **.env**-re, vagy kimásolod a teljes tartalmát, létrehozol egy **.env** fájlt és beilleszted.
> [!NOTE]
> **FONTOS:** a backend mappában legyen közvetlenül a ***.env***
```
ClanVerseProjekt_BodiszSedlakSimko/
├── backend/
│   ├── server.js
│   ├── serverAllPort.js
│   └── .env
```
#### c) Adatbázis létrehozása
- Nyitsd meg a XAMPP Control Panel-t
- Az Apache mellett nyomj a Start-ra és várd meg, míg zöld nem lesz
- MySQL-nél ismét nyomj a Start gombra, majd ha zöld, akkor nyomj az Admin gombra.
- Ekkor betölt a [phpMyAdmin](http://localhost/phpmyadmin/) oldal. Itt nyomj az SQL gombra
- Itt tudsz SQL kódokat írni, ezért itt is létre tudjuk hozni az alábbi kóddal:
```sql
CREATE DATABASE clanverse;
```
- Ha beillesztetted az alábbi kódot, nyomd meg a jobb alsó sarokban az **Indítás** gombot (vagy Ctrl + Enter-t ahova beírtad az SQL kódot)

#### d) Backend szerver elindítása
Ha telepítetted a csomagokat, létrehoztad az adatbázist, akkor lépj vissza a VSCode-ba és a terminal-ba írd be a következőt:
- Ha csak az adott számítőgépen szeretnéd futtatni a webalkalmazástm, akkor:
  ```bash
  node server.js
  ```
- Ha telefonon is meg szeretnéd nyitni, akkor <a id="serverAllPortLink"></a>:
  ```bash
  node serverAllPort.js
  ```
> [!NOTE]
> ha az összes porton szeretnéd futtatni a webalkalmazást, akkor ugyan azon a hálózaton kell lennie a futtató PC-nek és a telefonodnak

Ha minden jól megy, akkor csak ez jelenik meg a konzolon:
```bash
[dotenv@17.2.3] injecting env (13) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
Szerver elindult! http://localhost:3000
Siker: clanverse
Az adatbázis szinkronizálva.
Sikeres feltöltés! (20 játék)
Sikeres feltöltés! (20 felhasználó)
Sikeres feltöltés! (10 klán)
Sikeres feltöltés! (38 klántag)
Sikeres feltöltés! (13 üzenet)
```
Ezzel sikeresen elindítottad a szervert.

---

### 4. Frontend Beállítása

#### a) Függőségek telepítése
Ctrl + Shift + ö paranccsal nyiss ismét egy terminal-t.
Minden előtt le kell telepítened az Angular-t az alábbi paranccsal:
```bash
npm install -g @angular/cli@20.3
```
Ha ez letöltött, következő paranccsal belépsz a frontend mappába és letöltöd a csomagokat:
```bash
cd frontend
npm install
```


#### b) Angular szerver elindítása
Az alábbi paranccsal el tudod indítani az angulart:
```bash
ng serve
```
Az alkalmazás elérhető a `http://localhost:4200` címen.

**Ha telefonon szeretnéd megnyitni az alkalmazást**:
- Először az `ipconfig` paranccsal nézd meg a számítógéped IPv4 címét. *(pl: 192.168.1.67)*
- Ezt az IP címet írd be az **environment.ts** fájlba mind a 2 **"localhost"** helyére.
```
ClanVerseProjekt_BodiszSedlakSimko/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── environments/
│   │   │   │   └── environment.ts    # Ebben a fájlban kell átírni
```
- Így kell kinéznie az environment.ts-nek:
```ts
export const environment = {
    production: false,
    apiUrl:'http://192.168.1.5:3000/api',  // Minden futtatás előtt ellenőrizni kell a szervert futtató számítógép IP címét!
    serverUploadUrl: 'http://192.168.1.5:3000/uploads/' // Minden futtatás előtt ellenőrizni kell a szervert futtató számítógép IP címét!
};
```
- Ha az environment-et beállítottad, az alábbi paranccsal futtathatod minden porton az angulart:
```bash
ng serve --host 0.0.0.0
```
- A konzol alján meg fog jelenni 2 URL. **1 local és 1 network**
- Például:
```bash
  ➜  Local:   http://localhost:4200/       # csak az adott számítógép
  ➜  Network: http://192.168.1.67:4200/    # adott hálózaton belüli kommunikáció (LAN).
```
- Ha telefonon szeretnéd megnyitni, akkor neked az IP címet kell beírni a telefonod böngészőjébe.
> [!IMPORTANT]
> Ahhoz, hogy **használni tudd telefonon**, a **[serverAllPort.js](#serverAllPortLink) szervert kell futtatnod!**
> Valamint a **telefonodnak ugyan azon a hálózaton kell lennie**, mint a **szervvert futtató számítógépnek!** (Nem számít, hogy a PC vezetékesen csatlakozik, csak az, hogy "ugyan azon a router-en" legyenek az eszközök)

## 📡 Backend API Dokumentáció

### API Base URL: `http://localhost:3000/api`
---

### 👤 Felhasználó Kezelés (`/users`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/users/register` | POST | Új felhasználó regisztrációja | 201 Created - Felhasználó sikeresen regisztrálva <br/> 400 Bad Request - Hiányzó vagy érvénytelen adat <br/> 409 Conflict - Felhasználónév vagy email már használatban van <br/> 500 Internal Server Error - Szerverhiba |
| `/users/login` | POST | Felhasználó bejelentkezése | 200 OK - Sikeres bejelentkezés (JWT token) <br/> 401 Unauthorized - Hibás felhasználónév vagy jelszó<br/> 400 Bad Request - Hiányzó adatok <br/> 500 Internal Server Error - Szerverhiba |
| `/users/logout` | POST | Felhasználó kijelentkezése | 200 OK - Sikeres kijelentkezés <br/> 401 Unauthorized - Nincs autentikáció <br/> 500 Internal Server Error - Szerverhiba |
| `/users/validate` | GET | JWT token validálása | 200 OK - Token érvényes <br/> 401 Unauthorized - Token érvénytelen vagy lejárt <br/> 500 Internal Server Error - Szerverhiba |
| `/users/profile` | GET | Bejelentkezett felhasználó profiljának lekérdezése | 200 OK - Profil adatok <br/> 401 Unauthorized - Nincs autentikáció <br/> 404 Not Found - Felhasználó nem található <br/> 500 Internal Server Error - Szerverhiba |
| `/users/profile` | PUT | Felhasználó profiljának módosítása | 200 OK - Profil frissítve <br/> 401 Unauthorized - Hibás jelszó <br/> 409 Conflict - Email vagy felhasználónév már használatban van <br/> 500 Internal Server Error - Szerverhiba |

---

### 🏘️ Klánok Kezelése (`/clans`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/clans` | POST | Új klán létrehozása | 201 Created - Klán sikeresen létrehozva <br/> 400 Bad Request - Hiányzó adat <br/> 401 Unauthorized - Nincs autentikáció <br/> 409 Conflict - Már létezik ilyen néven klán <br/> 500 Internal Server Error - Szerverhiba |
| `/clans` | GET | Összes klán lekérdezése | 200 OK - Összes klán adat <br/> 400 Bad Request - Hiányzó adat <br/> 401 Unauthorized - Nincs autentikáció  <br/> 500 Internal Server Error - Adatbázis hiba |
| `/clans/:id` | GET | Specifikus klán adatainak lekérdezése | 200 OK - Klán adat <br/> 401 Unauthorized - Nincs autentikáció <br/> 404 Not Found - Klán nem található <br/> 500 Internal Server Error - Szerverhiba |
| `/clans/:id` | PUT | Klán módosítása | 200 OK - Klán frissítve <br/> 400 Bad Request - Érvénytelen adat <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nincs módosítási joga <br/> 404 Not Found - Klán nem található <br/> 409 Conflict - Már létezik ilyen néven klán <br/> 500 Internal Server Error - Szerverhiba |
| `/clans/:id` | DELETE | Klán törlése | 200 OK - Klán törölve <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nincs törlési joga <br/> 404 Not Found - Klán nem található <br/> 500 Internal Server Error - Szerverhiba |
| `/clans/:id/join` | POST | Csatlakozás egy klánhoz | 200 OK - Sikeresen csatlakoztál <br/> 401 Unauthorized - Nincs autentikáció <br/> 404 Not Found - Klán nem található <br/> 409 Conflict - Már tag vagy <br/> 500 Internal Server Error - Szerverhiba |
| `/clans/:id/leave` | POST | Kilépés egy klánból | 200 OK - Sikeresen kiléptél <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nem vagy tagja a klánnak <br/> 404 Not Found - Klán nem található <br/> 500 Internal Server Error - Szerverhiba |
| `/clans/:id/kick/:memberUserName` | POST | Tag kizárása a klánból | 200 OK - Tag kizárva <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nincs kizárási joga <br/> 404 Not Found - Tag nem található vagy Klán nem található vagy Az adott felhasználó nem tagja a klánnak <br/> 500 Internal Server Error - Szerverhiba |

---

### 💬 Üzenetek (`/messages`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/messages/:clanId` | POST | Üzenet küldése egy klánba | 201 Created - Üzenet elküldve <br/> 400 Bad Request - Hiányzó adatok <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nincs üzenetküldési joga <br/> 404 Not Found - Klán nem található <br/> 500 Internal Server Error - Szerverhiba |
| `/messages/:clanId` | GET | Klán összes üzenetének lekérdezése | 200 OK - Üzenetek listája <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nincs jogosultsága megtekinteni az üzeneteket <br/> 404 Not Found - Klán nem található <br/> 500 Internal Server Error - Szerverhiba |

---

### 🎮 Játékok (`/games`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/games` | GET | Összes játék lekérdezése (opcionális `search` query paraméterrel név alapján szűrhető) | 200 OK - Játékok listája (id, name) <br/> 500 Internal Server Error - Adatbázis hiba |


### 📊 Index Végpontok (`/`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/famous-games` | GET | Népszerű játékok lekérdezése | 200 OK - Népszerű játékok <br/> 500 Internal Server Error - Adatbázis hiba |
| `/famous-clans` | GET | Népszerű klánok lekérdezése | 200 OK - Népszerű klánok <br/> 500 Internal Server Error - Adatbázis hiba |

---

### 🔐 Admin Végpontok (`/admin`)


| Végpont URL | HTTP Módszer | Leírás | Státuszkód / Válasz |
|---|---|---|---|
| `/admin/is-admin` | GET | Ellenőrzés, hogy a felhasználó admin-e | 200 OK - Admin státusz info (true vagy false) <br/> 401 Unauthorized - Nincs autentikáció <br/> 500 Internal Server Error - Szerverhiba |
| `/admin/upload-game` | POST | Új játék feltöltése (csak admin) | 201 Created - Játék feltöltve <br/> 400 Bad Request - Hiányzó adat <br/> 401 Unauthorized - Nincs autentikáció <br/> 403 Forbidden - Nem admin <br/> 409 Conflict - Már létezik ilyen nevű játék <br/> 500 Internal Server Error - Szerverhiba |


---

## 📁 Projekt Szerkezete

```
ClanVerseProjekt_BodiszSedlakSimko/
├── backend/                          # Backend Express szerver
│   ├── controllers/                  # Üzleti logika
│   │   ├── admin.controller.js
│   │   ├── clans.controller.js
│   │   ├── game.controller.js
│   │   ├── index.controller.js
│   │   ├── messages.controller.js
│   │   └── user.controller.js
│   ├── models/                       # Sequelize adatmodellek
│   │   ├── clanMembers.js
│   │   ├── clans.js
│   │   ├── games.js
│   │   ├── messages.js
│   │   └── users.js
│   ├── routes/                       # API útvonalak
│   │   ├── admin.routes.js
│   │   ├── clans.routes.js
│   │   ├── game.routes.js
│   │   ├── index.routes.js
│   │   ├── messages.routes.js
│   │   └── user.routes.js
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                   # JWT autentikáció
│   │   ├── uploadGameLogo.js         # Játék logó feltöltés
│   │   └── uploadPfp.js              # Profilkép feltöltés
│   ├── data/                         # Példa adatokat tartalmazó objektumok
│   │   ├── clanMembers.json
│   │   ├── clans.json
│   │   ├── games.json
│   │   ├── messages.json
│   │   └── users.json
│   ├── database/                     # Adatbázis konfiguráció
│   │   └── sequelize.js
│   ├── seeds/                        # Adatbázis seeder-ek (data mappából)
│   │   ├── clanMembersSeed.js
│   │   ├── clansSeed.js
│   │   ├── gamesSeed.js
│   │   ├── messagesSeed.js
│   │   └── usersSeed.js
│   ├── utils/                        # Segédfunkciók
│   │   ├── config.js
│   │   ├── jwt.js
│   │   └── statusCode.js
│   ├── uploads/                      # Feltöltött fájlok
│   │   ├── gameLogos/
│   │   └── profilePictures/
│   ├── server.js                     # Fő szerver fájl
│   ├── serverAllPort.js              # Összes porton futó szerver
│   ├── package.json
│   ├── .env.example                  # Környezeti változók sablonja (titkos adatok nélkül)
│   └── .env                          # Környezeti változók
│
├── frontend/                         # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── component/            # Angular komponensek
│   │   │   │   ├── admin/
│   │   │   │   ├── aszf/
│   │   │   │   ├── clans/
│   │   │   │   ├── createclan/
│   │   │   │   ├── fooldal/
│   │   │   │   ├── footer/
│   │   │   │   ├── login/
│   │   │   │   ├── message/
│   │   │   │   ├── navbar/
│   │   │   │   ├── profile/
│   │   │   │   └── registration/
│   │   │   ├── services/             # Angular szolgáltatások
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── clan.service.ts
│   │   │   │   ├── game.service.ts
│   │   │   │   ├── messages.service.ts
│   │   │   │   └── user.service.ts
│   │   │   ├── guards/               # Route guardok
│   │   │   │   └── auth.guard.ts
│   │   │   ├── environments/         # Környezeti konfigurációk
│   │   │   ├── interceptors/         # HTTP interceptorok
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   ├── assets/                   # Statikus fájlok (projekt logok)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
├── Projekt_Terv.docx                 # A projektünk terve
└── README.md                         # Ez a dokumentáció
```
---

## 👥 Munkamenet és szervezés

### Csapattagok
- **Sedlák Ákos** - Backend fejlesztés, adatbázis tervezés, projekt menedzsment
- **Simkó Roland** - Frontend fejlesztés, színpaletta kitalálása
- **Bódisz Loránd** - Frontend fejlesztése

### Munkaeszközök
- [Trello munkatábla](https://trello.com/invite/68b697b329af5ab51cf055f0/ATTI7e4a49792d0ed6505ab84f81e367850dA5AD065B) - Feladatok és határidők, munkaszervezés
- [Figma tervek](https://www.figma.com/team_invite/redeem/RvYgqEkTn1ra6YEv1WpgUe) - UI/UX tervek
- [Discord szerver](https://discord.gg/kj8EgFfv4z) - Csapatkommunikáció
- [GitHub](https://github.com/KhAkosYT/ClanVerseProjekt_BodiszSedlakSimko/) - Verziókezelés

### Fejlesztési Megjegyzések
A projekt során több merge conflict történt a GitHub Desktop-on különösen akkor, amikor csapattagok párhuzamosan dolgoztak ugyanazokon a fájlokon. Ezek az esetek dokumentálva vannak a commit history-ban.

---

## 📝 Licencia

ISC License (Node.js alapú projektek standard licensze)

---

## 🎓 Tanulási Célok

Ez a projekt bemutatja a modern webalkalmazás-fejlesztés teljes ciklusát:
- **Backend:** Node.js, Express, SQL adatbázisok, REST API tervezés
- **Frontend:** Angular, TypeScript, modern CSS kezelés
- **DevOps:** Git verziókezelés, csapatmunka, deployment
- **Szoftverfejlesztés:** Agilis módszertan, tesztelés, dokumentáció

---

**Készült: 2026. március 6.**

