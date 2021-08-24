//jshint esversion:6

// Module declarations
const express = require("express");

// Set app to use EJS
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(express.static("public"));

// Routing to homepage
app.get("/", function(req, res){
    res.render("homepage");
});

// Routing to vault page
app.get("/vault", function(req,res){
    res.render("vault");
});

// Routing to most wanted page
app.get("/mostwanted", function(req,res){
    res.render("mostwanted");
});

// Set port to Heroku's port or localhost:3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});