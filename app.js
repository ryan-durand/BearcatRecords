//jshint esversion:6

// Module declarations
const express = require("express");
const mongoose = require("mongoose");

// Set app to use EJS
const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to Mongoose database backend
mongoose.connect("mongodb://localhost:27017/musicDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema for the list database
const albumsSchema = mongoose.Schema({
  artist: {
    type: String,
    required: [true, "All entries need an artist name."],
  },
  title: {
    type: String,
    required: [true, "All entries need a project title."],
  },
  listen: {
    type: String,
  },
});

const Album = mongoose.model("Album", albumsSchema);

// example albums that will populate the backlog if it is empty
const beUpAHello = new Album({
  artist: "Squarepusher",
  title: "Be Up A Hello",
  listen:
    "https://www.youtube.com/watch?v=ODtzaxx-ifc&list=OLAK5uy_lb3RkVZOSxQTx1XBHQ7PeAIzQ_Jd8AAjk&index=1",
});

const melee = new Album({
  artist: "Dogleg",
  title: "Melee",
  listen:
    "https://www.youtube.com/watch?v=_BrZUwzrvVI&list=PLNcHHgfUCHDaCKUReDsh6W8KDlQcdPmtT",
});

const noDream = new Album({
  artist: "Jeff Rosenstock",
  title: "NO DREAM",
  listen:
    "https://www.youtube.com/watch?v=T2UVigK4dA8&list=PL8M_6pUgzQuUySDUembnytFIYKskRzj_D",
});

const defaultItems = [beUpAHello, melee, noDream];

// Routing to homepage
app.get("/", function (req, res) {
  res.render("homepage");
});

// Routing to vault page
app.get("/vault", function (req, res) {
  res.render("vault");
});

// Routing to most wanted page
app.get("/mostwanted", function (req, res) {
  res.render("mostwanted");
});

// Routing to community playlist page
app.get("/list", function (req, res) {
  Album.find(function (err, albums) {
    //insert default albums if the list is empty
    if (albums.length === 0) {
      Album.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved albums.");
        }
      });
      //kickback to root route then skip straight to the last else block
      res.redirect("/list");
    } else {
      res.render("list", {
        listTitle: "Community Playlist",
        newListItems: albums,
      });
    }
  });
});

app.post("/list", function (req, res) {
  //creates a new Album document and saves it to the database
  const artistName = req.body.newArtist;
  const albumTitle = req.body.newTitle;
  //const listenLink = req.body.newLink;

  const newAlbum = new Album({
    artist: artistName,
    title: albumTitle,
    //listen: listenLink,
  });

  newAlbum.save();
  res.redirect("/list");
});

//deletes list entries and deletes document from database
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Album.findOneAndDelete(checkedItemId, function (err) {
    if (!err) {
      console.log("Entry deleted.");
      res.redirect("/list");
    }
  });
});

// Set port to Heroku's port or localhost:3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
