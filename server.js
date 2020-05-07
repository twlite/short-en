// require packages
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const config = require("./config.json");
const URL = require("./models/URL");

// Database Connection
async function connect() {
    await mongoose.connect(config.databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};
connect();

const port = process.env.PORT || config.port;

// setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    let urls = await URL.find();
    res.render("index", {
        title: "Home",
        urls: urls.reverse()
    });
});

app.post("/", async (req, res) => {
    if (!req.body) return res.send({ error: "No body provided!" });
    let struct = await URL.create({
        mainURL: req.body.url,
        nsfw: req.body.nsfw ? true : false
    });
    struct.save().catch(e => {});
    return res.redirect("/");
});

app.get("/reset", async (req, res) => {
    res.render("reset", {
        title: "Home"
    });
});

app.get("/reset/confirm", async (req, res) => {
  let pass = req.query.password;
  if (!pass) return res.redirect("/401");
  if (pass !== process.env.PASSWORD) return res.redirect("/401");
  console.log(process.env.PASSWORD + " | " + pass)
  let data = await URL.find();
  data.forEach(async data => {
    await URL.findOneAndDelete({ mainURL: data.mainURL }).catch(e => {});
  });
    res.redirect("/");
});

app.get("/:id", async(req, res) => {
    if (!req.params.id) return res.redirect("/");
    let has = await URL.findOne({ shortURL: req.params.id });
    if (!has || has === null) return res.redirect("/");
    has.clicks++
    has.save().catch(e => {});
    return res.redirect(has.mainURL);
});

app.get("/401", (req, res) => {
  return res.status(401).send({ error: "Unauthorized" })
})

// live server
server.listen(port, () => {
    console.log("Server running on port *"+ port);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me`)
}, 280000)
