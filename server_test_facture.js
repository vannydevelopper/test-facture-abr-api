const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const factureRouter = require("./routes/factureRouter");
const bindUser = require("./middleware/bindUser");
// const { startSync } = require("./controller/factureController");

const app = express();

dotenv.config({ path: path.join(__dirname, "./.env") });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", bindUser);
app.use("/factures", factureRouter);

const port = 8085;

app.listen(port, async () => {
          console.log("server is running on port: " + port);
        //   startSync()
});
