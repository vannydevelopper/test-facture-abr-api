const express = require("express");
const factureController = require("../controller/factureController");

const factureRouter = express.Router();

factureRouter.get("/selectAndSend", factureController.selectAndSend);
factureRouter.get("/cancelInvoice", factureController.cancelInvoice);

module.exports = factureRouter;
