const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

app.set("views", path.resolve(__dirname, "templates"))
app.set("view engine", "ejs")


// http://localhost:3000/signup/
router.get("/", (req, res) => {
    res.render("signUp")
});

const databaseAndCollection = { db: "HarmonyScout_DB", collection: "Account" };
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_CONNECTION_STRING;
router.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

router.post("/processingData", async (req, res) => {
    let { username, email, password } = req.body
    console.log(`HERE: data recieved, username: ${username}, email: ${email}, pass: ${password}`)
    let userAccount = { username: username, email: email, password: password }
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 })
    try {
        await client.connect()
        await insertUserAccount(userAccount, databaseAndCollection, client)
        // console.log("user: ", userAccount)
        res.render('user', userAccount)
        // res.send(userAccount)

    } catch (e) {
        console.log("Err idek: ", e)
    } finally {
        await client.close()
    }

})

async function insertUserAccount(userAccount, databaseAndCollection, client) {
    const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection).insertOne(userAccount);
    console.log(`Applicants inserted: ${result.insertedId}`);
}


// router.post("/processingData", (req, res) => {
//     console.log("here after processing data, data is: ", req.body)
//     const userAccount = req.userAccount
//     //res.sendFile(path.join(__dirname, 'final', 'templates', 'user.html'));

// })


module.exports = router;