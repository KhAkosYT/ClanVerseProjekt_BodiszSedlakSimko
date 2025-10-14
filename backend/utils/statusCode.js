const handleError = (status, uzenet) => {
    return (error, req, res, next, reason) => {
        if(error){
            console.error(`Hiba (${status}): ${error}.`);
        }
        else{
            console.error(`Váratlan hiba történt (Státusz: ${status}).`);
        }

        if(!reason || reason.length < 2){
            res.status(status).json({ 
                status,
                message: uzenet 
            });
        }

        res.status(status).json({ 
            status,
            message: uzenet,
            reason: reason 
        });
    };
};

const Code400 = handleError(400, "Hibás kérés.");
const Code401 = handleError(401, "Nincs jogosultsága a felhasználónak");
const Code403 = handleError(403, "Elutasítva");
const Code404 = handleError(404, "Az erőforrás nem található");
const Code409 = handleError(409, "Konfliktus");
const Code500 = handleError(500, "Adatbázis / szerver hiba");

module.exports = {
    Code400,
    Code401,
    Code403,
    Code404,
    Code409,
    Code500
};