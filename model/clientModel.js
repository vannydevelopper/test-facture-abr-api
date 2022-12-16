const { query } = require("../functions/db")

const findBy = async (column, value) => {
          try  {
                    return query(`SELECT * FROM clients WHERE ${column} = ?`, [value])
          } catch (error) {
                    throw error
          }
}

const findAll = async () => {
          try  {
                    return query(`SELECT * FROM clients`)
          } catch (error) {
                    throw error
          }
}

module.exports = {
          findBy,
          findAll
}