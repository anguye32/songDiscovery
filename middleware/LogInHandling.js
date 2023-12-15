const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

app.set("views", path.resolve(__dirname, "templates"))
app.set("view engine", "ejs")

const databaseAndCollection = { db: "HarmonyScout_DB", collection: "Account" };
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_CONNECTION_STRING;
router.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

router.get("/", (req, res) => {
    res.render("signIn")
});

router.post("/retrieveData", async (req, res) => {
    let { username, email, password } = req.body
    // console.log(`HERE: data recieved, username: ${username}, email: ${email}, pass: ${password}`)
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 })
    try {
        await client.connect()
        let filter = { username: username, password: password };
        if (username.includes("@")) {
            filter = { email: username, password: password };
        }
        console.log("filter:", filter)
        let accountFound = await lookupOneAccount(client, databaseAndCollection, filter)
        // req.userAccount = userAccount;
        console.log("accountFound: ", accountFound)
        if (accountFound === null) {
            res.status(500).send("ERRRRRRRRRRRRRR")
        }
        res.render('user', accountFound)
        // res.send(userAccount)

    } catch (e) {
        console.log("Err idek: ", e)
    } finally {
        await client.close()
    }

})

async function lookupOneAccount(client, databaseAndCollection, filter) {
    const result = client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .findOne(filter);
    // console.log("account found: ", result);

    return result;
}

module.exports = router;