const { query } = require("../functions/db");

const findAll = async (ID_CLIENT) => {
          try {
                    var sqlQuery = "SELECT * FROM facture_club WHERE 1 AND ID_CLIENT = ? AND IS_SEND = 0 AND FACTURE_ID IN(SELECT MAX(`FACTURE_ID`) as `FACTURE_ID` FROM facture_club GROUP BY NUMERO_FATURE) LIMIT 10 "
                    return query(sqlQuery, [ID_CLIENT]);
          } catch (error) {
                    throw error;
          }
};


const cancelinvoice = async (ID_CLIENT) => {
    try {
              var sqlQuery = "SELECT * FROM facture_club WHERE 1 AND ID_CLIENT = ? AND IS_ANNULE = 2 LIMIT 10 "
              return query(sqlQuery, [ID_CLIENT]);
    } catch (error) {
              throw error;
    }
};



const findByNumeroFacture = async (numeroFacture) => {
          try {
                    var sqlQuery = `SELECT * FROM facture_club WHERE NUMERO_FATURE = ? AND IS_SEND = 0`
                    return query(sqlQuery, [numeroFacture]);
          } catch (error) {
                    throw error;
          }
}

const setSended = async (signature,NUMERO_FATURE) => {
          //console.log("NUMERO_FATURE", NUMERO_FATURE)
          try {
                    var sqlQuery = "UPDATE facture_club SET SIGNATURE=?,IS_SEND = 1 WHERE NUMERO_FATURE = ?"
                    return query(sqlQuery, [signature,NUMERO_FATURE]);
          } catch (error) {
                    throw error;
          }
}


const updateFactureExist = async (NUMERO_FATURE) => {
    //console.log("NUMERO_FATURE", NUMERO_FATURE)
    try {
              var sqlQuery = "UPDATE facture_club SET IS_SEND = 2 WHERE NUMERO_FATURE = ?"
              return query(sqlQuery, [NUMERO_FATURE]);
    } catch (error) {
              throw error;
    }
}

const update_annuler = async (signature) => {

    try {
              var sqlQuery = "UPDATE facture_club SET IS_ANNULE = 1 WHERE SIGNATURE = ?"
              return query(sqlQuery, [signature]);
    } catch (error) {
              throw error;
    }
}

module.exports = {
          findAll,
          findByNumeroFacture,
          setSended,
          cancelinvoice,
          update_annuler,
          updateFactureExist
};
