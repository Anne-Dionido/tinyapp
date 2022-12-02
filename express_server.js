const express = require("express");
const app = express();
const PORT = 8080;
let cookieParser = require("cookie-parser");
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true })); 


let randomString = function() {
  const inputArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let randomStr = '';
  for (let i = 0; i <= 6; i++) {
    let randomNum = Math.floor(Math.random() * inputArr.length);
    randomStr = randomStr + inputArr[randomNum];
  }
  return randomStr;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls", (req, res) => {
  console.log(req.body); 
  const urlShortCode = randomString();
  urlDatabase[urlShortCode] = req.body.longURL;

  res.redirect(`/urls/${urlShortCode}`); 
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post('/urls/:id', (req, res) => {
  const urlId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[urlId] = longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  const urlID = req.params.id;
  delete urlDatabase[urlID];
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post('/login', (req, res) => {

  const username = req.body.username;
  res.cookie('username', username);

  res.redirect('/urls');
});

app.post('/logout', (req, res) => {

  const username = req.body.username;
  res.clearCookie('username', username);

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});