// require packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config.json");
const URL = require("./models/URL");

// Database Connection
async function connect() {
    await mongoose.connect(config.databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('Database connected!');
};

connect();

// port to run web server on
const port = process.env.PORT || config.port;

// setup
// add view engine to render ejs templates
app.set("view engine", "ejs");
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// main route, lists all urls
app.get("/", async (req, res) => {
    const urls = await URL.find();
    res.render("index", {
        title: "Home",
        urls: urls.reverse()
    });
});

// post route used to create new url
app.post("/", async (req, res) => {
    if (!req.body) return res.send({ error: "No body provided!" });
    const struct = await URL.create({
        mainURL: req.body.url,
        nsfw: Boolean(req.body.nsfw)
    });

    await struct.save().catch(e => { });

    return res.redirect("/");
});

// get route used to redirect the short url to main url
app.get("/:id", async (req, res) => {
    if (!req.params.id) return res.redirect("/");
    const has = await URL.findOne({ shortURL: req.params.id });
    if (!has || has === null) return res.redirect("/");
    has.clicks++
    has.save().catch(e => { });
    return res.redirect(has.mainURL);
});

// run web server
app.listen(port, () => {
    console.log("Server running on port *" + port);
    console.log("http://localhost:" + port);
});
