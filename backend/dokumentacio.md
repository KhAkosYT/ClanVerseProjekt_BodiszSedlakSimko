> [!IMPORTANT]
> Ez a dokumentáció a fejlesztés során bővül, **nem a végleges**!
> Leginkább a frontenden dolgozónak szeretnék ezzel segíteni
___
## ALAP STÁTUSZKÓD ÜZENETEK 
**Magyarul ezt mindig küldi a backend**
1.  **400** : *message: "Hibás kérés."*
2.  **401** : *message: "Nincs jogosultsága a felhasználónak"*
3.  **403** : *message: "Elutasítva"*
4.  **404** : *message: "Az erőforrás nem található"*
5.  **409** : *message: "Konfliktus"*
6.  **500** : *message: "Adatbázis / szerver hiba"*
___
## VÉGPONTOK
1. **/api/users/register**
Elvárt értékek, amiket kér az api végpont
   - username
   - email
   - password
  
  - HTTP **POST** metódus

  - **Ha hiányzik valamelyik**, akkor **400-as státusz kóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
  - **Ha létezik egy felhasználó** *(email alapján van az ellenőrzés)*, akkor **409-es státusz kóddal** tér vissza ***"Már létezik ezzel az email címmel fiók."* REASON-nel**
  - **Ha minden jó**, akkor **létrehozza a felhasználót** és **201-es státusz kóddal** tér vissza, majd **küld** egy **MESSAGE-et *"Sikeres regisztráció."*** szöveggel, valamint a ***userId*-t küldi vissza**
  - **Ha valahol mégis hiba történne** (és nem tudja a felhasználót lekérdezni az adatbázisból vagy létrehozni azt), akkor **500-as státusz kóddal** tér vissza
___

2. **/api/users/login**
Elvárt értékek, amiket kér az api végpont
   - username
   - password
  
  - HTTP **POST** metódus

  - **Ha hiányzik valamelyik**, akkor **400-as státusz kóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
  - **Ha nem talál a felhasználónév alapján** egy felhasználót sem, akkor **401-es státusz kóddal és *"Hibás felhasználónév vagy jelszó."* REASON-nel** tér vissza
  - **Ha van fiók a felhnévvel**, de a ***(a titkosított)* jelszó nem egyezik, akkor  401-es státusz kóddal és *"Hibás felhasználónév vagy jelszó."* REASON-nel** tér vissza
  - **Ha minden jó**, akkor **200-as státusz kóddal** tér vissza, és **visszaküld egy MESSAGE-et *"Sikeres bejelentkezés."* szöveggel, a *userId*-t és a *token***-t
  - **Ha valami mégsem jó**, akkor **500-as státusz kóddal** tér vissza
___

3. **/api/users/logout**
- **200-as státusz kóddal** és ***"Sikeres kijelentkezés."* szövegű *MESSAGE*-el** tér vissza
___

4. **/api/clans**
Elvárt értékek, amiket kér az api végpont
   - clanName
   - game
   - description
  
  - HTTP **POST** metódus

  - **Ha hiányzik valamelyik**, akkor **400-as státusz kóddal** és ***"hiányzó adatok"* REASON-nel** tér vissza, de a **frontenden is kezelni kell, hogy ne lehessen hiányzó adat!**
  - **Ha létezik egy klán** *(klán név alapján van az ellenőrzés)*, akkor **409-es státusz kóddal** tér vissza ***"Már létezik ilyen néven klán."* REASON-nel**
  - **Ha minden jó**, akkor **létrehozza a klánt** és **201-es státusz kóddal** tér vissza, majd **küld** egy **MESSAGE-et *"Klán létrehozva"*** szöveggel tér vissza
  - **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni az adatbázisból vagy létrehozni azt), akkor **500-as státusz kóddal** tér vissza
___

5. **/api/clans**  
  - HTTP **GET** metódus

  - Az **adatbázisból lekéri az összes klánt**, és **visszaküldi** azt egy **"clans" objektumban 200-as státusz kóddal**
  - **Ha valahol mégis hiba történne** (és nem tudja a klánt lekérdezni az adatbázisból vagy létrehozni azt), akkor **500-as státusz kóddal** tér vissza
___

6. 