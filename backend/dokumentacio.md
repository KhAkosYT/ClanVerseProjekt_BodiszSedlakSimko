> [!IMPORTANT]
> Ez a dokumentáció a fejlesztés során bővül, **nem a végleges**!
> Leginkább a frontenden dolgozónak szeretnék ezzel segíteni

___

## ALAP STÁTUSZKÓD ÜZENETEK [ami saját]([https://youtube.com/](https://github.com/KhAkosYT/ClanVerseProjekt_BodiszSedlakSimko/blob/main/backend/utils/statusCode.js))

**Magyarul ezt mindig küldi a backend**

1. **400** : *message: "Hibás kérés."*
2. **401** : *message: "Nincs jogosultsága a felhasználónak"*
3. **403** : *message: "Elutasítva"*
4. **404** : *message: "Az erőforrás nem található"*
5. **409** : *message: "Konfliktus"*
6. **500** : *message: "Adatbázis / szerver hiba"*

___

## VÉGPONTOK

1. **/api/users/register** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - username
   - email
   - password

- HTTP **POST** metódus
- **Ha hiányzik valamelyik**, akkor **400-as státuszkóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
- **Ha létezik egy felhasználó** *(email alapján van az ellenőrzés)*, akkor **409-es státuszkóddal** tér vissza ***"Már létezik ezzel az email címmel fiók."* REASON-nel**
- **Ha minden jó**, akkor **létrehozza a felhasználót** és **201-es státuszkóddal** tér vissza, majd **küld** egy **MESSAGE-et *"Sikeres regisztráció."*** szöveggel, valamint a ***userId*-t küldi vissza**
- **Ha valahol mégis hiba történne** (és nem tudja a felhasználót lekérdezni az adatbázisból vagy létrehozni azt), akkor **500-as státuszkóddal** tér vissza

___

2. **/api/users/login** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - username
   - password

- HTTP **POST** metódus
- **Ha hiányzik valamelyik**, akkor **400-as státuszkóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
- **Ha nem talál a felhasználónév alapján** egy felhasználót sem, akkor **401-es státuszkóddal és *"Hibás felhasználónév vagy jelszó."* REASON-nel** tér vissza
- **Ha van fiók a felhnévvel**, de a ***(a titkosított)* jelszó nem egyezik, akkor  401-es státuszkóddal és *"Hibás felhasználónév vagy jelszó."* REASON-nel** tér vissza
- **Ha minden jó**, akkor **200-as státuszkóddal** tér vissza, és **visszaküld egy MESSAGE-et *"Sikeres bejelentkezés."* szöveggel, a *userId*-t és a *token***-t
- **Ha valami mégsem jó**, akkor **500-as státuszkóddal** tér vissza

___

3. **/api/users/logout**

- **200-as státuszkóddal** és ***"Sikeres kijelentkezés."* szövegű *MESSAGE*-el** tér vissza

___

4. **/api/clans** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - clanName
   - game
   - description

- HTTP **POST** metódus
- **Ha hiányzik valamelyik**, akkor **400-as státuszkóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
- **Ha létezik egy klán** *(klán név alapján van az ellenőrzés)*, akkor **409-es státuszkóddal** tér vissza ***"Már létezik ilyen néven klán."* REASON-nel**
- **Ha minden jó**, akkor **létrehozza a klánt** és **201-es státuszkóddal** tér vissza, majd **küld** egy **MESSAGE-et *"Klán létrehozva"*** szöveggel tér vissza
- **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni az adatbázisból vagy létrehozni azt), akkor **500-as státuszkóddal** tér vissza

___

5. **/api/clans**

- HTTP **GET** metódus
- Az **adatbázisból lekéri az összes klánt**, és **visszaküldi** azt egy **"clans" objektumban 200-as státuszkóddal**
- **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni az adatbázisból), akkor **500-as státuszkóddal** tér vissza

___

6. **/api/clans/:id** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - userId (csak el kell küldeni a front-ról a JWT-t)
   - id ({object}; ezt az urlből olvassa ki, ha nem megy úgyis segítek, mert mindenre írtam saját frontend-et)

- HTTP **GET** metódus
- Az **adatbázisból lekéri az ADOTT ID-VAL RENDELKEZŐ klánt**, **megkeresi** az **összes tagot a ClanMembers táblából** (a klán ID alapján), a **ClanMembers táblakapcsolat segítségével** a **Users táblából** a klán **tagok nevét**, és mind ezt **visszaküldi** ilyen módon:

```json
  {
    "clanData": {
        "id": 1,
        "name": "Teszt klán",
        "gameName": "Minecraft",
        "description": "Ez itt a klan leirasa.",
        "allMembers": [
            {
                "name": "enn",
                "role": "leader"
            }
        ]
    },
      //HA LEADER, CSAK AZ "EDITABLE"-T KAPJA, NEM KAP "CANJOIN"-T
      "editable": true,
      //HA NEM LEADER A ROLE ES NEM KLAN TAG:
      "canJoin": true
      //HA NEM LEADER A ROLE ES KLAN TAG:
      "canJoin": false
      //MAGYARUL, HA MAR A CLANMEMBERS TABLABAN BENNE VAN ES NEM LEADER, AKKOR A CANJOIN FALSE, KULONBEN TRUE
  }
```

- Lehet kicsit érthetőbb a JS kóddal is:

```js
  const isLeader = await ClanMembers.findOne({ where: { clanId: clan.id, userId: userId, role: "leader" }});
  if(isLeader){
    res.status(200).json({ clan, allClanMembers, allClanMembersName, editable: true });
  }

  const isMember = await ClanMembers.findOne({ where: { clanId: clan.id, userId: userId}});
  if(isMember){
      res.status(200).json({ clan, allClanMembers, allClanMembersName, canJoin: false });
  }

  res.status(200).json({ clan, allClanMembers, allClanMembersName, canJoin: true });
```

- **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni az adatbázisból), akkor **500-as státuszkóddal** tér vissza

___

7. **/api/clans/:id** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - id ({object}; ezt az urlből olvassa ki, ha nem megy úgyis segítek, mert mindenre írtam saját frontend-et)
   - userId ({object}; ezt a tokenből olvassa ki, ami ugye a localstorage-ben van eltárolva)

- HTTP **DELETE** metódus
- A **frontenden is kezelve kell lennie**, de ha valahogy mégis egy **olyan próbálja törölni a klánt, akinek nem lenne szabad**, abban az esetben **403-as státuszkóddal** és **"Nincs jogosultságod a klán törléséhez" MESSAGE**-el tér vissza
- Az **adatbázisból lekéri az ADOTT ID-VAL RENDELKEZŐ klánt**, és **kitörli az adott id alapján**, majd ezután **200-as státuszkóddal** visszatér, és egy **"Klán törölve"** MESSAGE üzenettel
- **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni vagy törölni az adatbázisból), akkor **500-as státuszkóddal** tér vissza

___

8. **/api/clans/:id** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - id ({object}; ezt az urlből olvassa ki, ha nem megy úgyis segítek, mert mindenre írtam saját frontend-et)
   - userId ({object}; ezt a tokenből olvassa ki, ami ugye a localstorage-ben van eltárolva)
   - newClanName, **!!newGame!!**, newClanDescriptio ({object}; ezeket mind a weboldal body részéből kéri)

- HTTP **PUT** metódus
- Ha **nincs** az **adott Id-val rendelkező klán** az **adatbázisban**, akkor **404-es státuszkóddal** és **"Nincs ilyen klán" MESSAGE**-el tér vissza
- Az **adatbázisból lekéri az ADOTT ID-VAL RENDELKEZŐ klánt**, és ha a felhasználó nem a tulajdonos, akkor **403-as státuszkóddal**, valamint egy **"Nincs jogosultságod a klán módosításához" MESSAGE**-el tér vissza
- Ha **ő a tulajdonos**, akkor a **backend kezeli**, hogy **létezik-e a megadott változó, ha igen,** akkor **egyezik-e az adatbázisban tárolt értékkel.** Ha **nem** egyezik, akkor **megváltoztatja, lementi, 200-as státuszkóddal visszatér,** valamint egy **"Klán frissítve." MESSAGE**-el és természetesen **visszaadja a klánt** a frontendnek.
- **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni vagy módosítani az adatbázisban), akkor **500-as státuszkóddal** tér vissza

___

9. **/api/clans/:id/join** <br>
   <ins>**Elvárt értékek**</ins>, amiket kér az api végpont
   - id ({object}; ezt az urlből olvassa ki)
   - userId ({object}; ezt a tokenből olvassa ki, ami ugye a localstorage-ben van eltárolva)

- HTTP **POST** metódus
- **Lekéri** az **adott id**-val rendelkező **klánt**, ha **nem talál** ilyet, akkor **404-es státuszkóddal és "Nincs ilyen klán" MESSAGE-el tér vissza**
- **Ellenőrzi** a **ClanMembers táblában** az adott **id és userId segítségével**, hogy **tag-e**, ha **igen**, akkor **409-es státuszkóddal** és **"Konfliktus: Már tagja vagy a klánnak" MESSAGE**-el **tér vissza**
- **Létrehoz** a **ClanMembers táblába egy rekordot**, amibe **bekerül "clanId"-ként** az **url-ből** kiszedett **id**, és a **tokenből kiszedett userId** pedig **"userId"-ként**
- Ha **sikeresen létrejött** ez a rekord, akkor **200-as státuszkóddal** és **"Sikeresen csatlakoztál a klánhoz" MESSAGE-el tér vissza**
- **Ha valahol mégis hiba történne** (nem tudja létrehozni az új tagot), akkor **500-as státuszkóddal** tér vissza

___

10.**/api/clans/:id/leave** <br>
<ins>**Elvárt értékek**</ins>, amiket kér az api végpont

- id ({object}; ezt az urlből olvassa ki)
- userId ({object}; ezt a tokenből olvassa ki, ami ugye a localstorage-ben van eltárolva)

- HTTP **POST** metódus
- **Lekéri** az **adott id**-val rendelkező **klánt**, ha **nem talál** ilyet, akkor **404-es státuszkóddal és "Nincs ilyen klán" MESSAGE-el tér vissza**
- itt az eljárást át kell dolgoznom majd, de ezen belül van egy:
- Ha a **felhasználó** az **utolsó tag** a klánban és **ki akar lépni**, akkor **törlődik a klán teljesen**, és ebben az esetben **200-as státuszkóddal** és **"Kiléptél, és mivel egyedül voltál, a klán törölve lett." MESSAGE-el tér vissza**
- Alap esetben csak törlődik, **200-as státuszkóddal** és **"Sikeresen kiléptél a klánból" MESSAGE-el tér vissza**
- Ha valahol elakad a program (pl nem tudja törölni a tagot), akkor **500-as státuszkóddal** tér vissza

___

11.  **/api/games** <br>
    <ins>**Elvárt értékek**</ins>, amiket kér az api végpont

 - az api url így néz ki a fronton: **http://localhost:3000/api/games?search=${encodeURIComponent(game)}**

 - HTTP **POST** metódus

 - Lényegében ez annyit tesz, hogy **minden alkalommal**, amikor a **klán létrehozásnál** (?később? a klán keresésnél) írnak a **játék input mezőbe**, akkor hívódik meg ez mindig *(addEventListener("input") ...)*, és folyamatosan azokat a klánokat küldi vissza a frontra, amelyiknek a nevében van egyezés.
 - Legegyszerűbb példa: beírom, hogy **"lea"**, akkor kiadja a *League of Legends-et*, a *Rocket Leage-et* stb stb.
 - Ha valamiért **nem tudja lekérni** a **jétéko(ka)t**, akkor **500-as státusz kóddal** tér vissza.

___

12. **/api/clans/:id/kick/:memberUserId** <br>
<ins>**Elvárt értékek**</ins>, amiket kér az api végpont

- id (URL paraméter; a klán azonosítója)
- memberUserId (URL paraméter; a kirúgni kívánt felhasználó azonosítója)
- userId (a tokenből kerül kiolvasásra)

- HTTP **POST** metódus
- Ha **nem létezik a klán** az adott ID-val, akkor **404-es státuszkóddal** és **"Nincs ilyen klán" MESSAGE-el** tér vissza
- A rendszer ellenőrzi, hogy a kérést indító felhasználó a klán **Leader-e**. Ha nem, **403-as státuszkóddal** és **"Nincs jogosultságod a klán tagjainak kirúgásához" MESSAGE-el** tér vissza
- Ha a célszemély **nem tagja a klánnak**, akkor **404-es státuszkóddal** és **"A megadott felhasználó nem tagja a klánnak" MESSAGE-el** tér vissza
- **Vezetőt nem lehet kirúgni**: ha a célszemély role-ja **"leader"**, akkor **403-as státuszkóddal** és **"Nem tudod kirúgni a klán vezetőjét" MESSAGE-el** tér vissza
- Sikeres törlés esetén **200-as státuszkóddal** és **"Sikeresen kirúgtad a tagot a klánból" MESSAGE-el** tér vissza
- Hiba esetén (adatbázis hiba) **500-as státuszkóddal** tér vissza

___

13.  **/api/messages/:clanId** <br>
<ins>**Elvárt értékek**</ins>, amiket kér az api végpont

- clanId (URL paraméter)
- userId (a tokenből kerül kiolvasásra)
- message (csak POST kérésnél, body-ban küldve)

HTTP **GET** metódus *(Üzenetek lekérése)*:
- Ellenőrzi, hogy a felhasználó tagja-e a klánnak. Ha nem, **403-as státuszkód** és **"Nincs jogosultságod a klán üzeneteinek lekéréséhez" MESSAGE**
- Ha a klán nem létezik, **404-es hiba**
- Siker esetén visszaadja a **clanName-et** és egy **messages tömböt (sender, message, time)**, **200-as státuszkóddal**

HTTP **POST** metódus *(Üzenet küldése)*:
- Csak klántagok küldhetnek üzenetet (**403-as hiba**, ha nem tag)
- Ha hiányzik a klán, **404-es hiba**
- Siker esetén létrehozza az üzenetet és **200-as státuszkóddal**, valamint **"Sikeres üzenetküldés" MESSAGE-el** tér vissza

___

14. **/api/famous-games**

- HTTP **GET** metódus
- Lekéri az **5 legnépszerűbb játékot** az alapján, hogy mennyi klán van hozzájuk rendelve
- **200-as státuszkóddal** visszaküld egy **"games" tömböt (id, gameName, logo, totalGameCount)**

___

15. **/api/famous-clans**

- HTTP **GET** metódus
- Lekéri az **5 legnagyobb létszámú klánt**
- **200-as státuszkóddal** visszaküld egy **"clans" tömböt (id, clanName, gameName, gameLogo, currentClanMembersCount)**

___

16. **/api/admin/upload-game** <br>
<ins>**Elvárt értékek**</ins>, amiket kér az api végpont

- gameName (body)
- logo (file formátumban)
- isAdmin (tokenből kerül ellenőrzésre)

- HTTP **POST** metódus
- Ha a felhasználó **nem admin**, akkor **403-as státuszkóddal** és **"Nincs jogosultságod a játék feltöltéséhez." MESSAGE-el** tér vissza
- Ha hiányzik a gameName, akkor **400-as státuszkód** és **"Hiányzó adatok."**
- Ha a játék már létezik (név alapján), akkor **409-es státuszkód** és **"Már létezik ilyen néven játék."**
- A backend kezeli a fájlfeltöltést: ha nincs kép, a **gameLogos/gameNotFound.jpg** lesz az alapértelmezett
- Siker esetén **201-es státuszkóddal**, **"Játék sikeresen hozzáadva." MESSAGE-el**, valamint a játék adataival tér vissza
