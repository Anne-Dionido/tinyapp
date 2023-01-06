const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
app.set("view engine", "ejs");
const bcrypt = require("bcryptjs");

app.use(express.urlencoded({ extended: true })); //added for POST requests

app.use(cookieSession({
  name: 'user_id',
  keys: ['user_id'],
 
  maxAge: 24 * 60 * 60 * 1000
}));


let { randomString, getUserByEmail, urlsForUser } = require('./helpers');


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.yahoo.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  ixVoGr: {
    longURL: "https://www.apple.ca",
    userID: "aJ50lW",
  },
  ebDoGx: {
    longURL: "https://www.costco.ca",
    userID: "123456",
  },
};

const users = {
  GOEQHgt: {
    id: 'GOEQHgt',
    email: 'd@d.com',
    password: '$2a$10$2jEvZDsrfpQy6SGLuKFjzeGs.CGMIbWPmHCrAUzA2O7yhqSsB.ywC'
  }
};


app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//URLS => list of all of the user's URLs

app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id, urlDatabase)
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    let templateVars = {
      status: 401,
      message: 'You need to be logged in to perform that action',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  } else {
    const longURL = req.body.longURL;
    const userID = req.session.user_id;
    const shortURL = addURL(longURL, userID, urlDatabase);
    res.redirect(`/urls/${shortURL}`);
  }
});


app.get("/u/:id", (req, res) => {

  if (urlDatabase[req.params.id]) {
    const longURL = urlDatabase[req.params.id].longURL;

    if (!longURL) {
      res.status(400).send(`<h1>This short url does not exist!<h1> <a href ="/u/:id">Back to short URL</a>`);
    } else {
      res.redirect(longURL);
    }
  } else {
    res.status(400).send(`<h1>This short url does not exist!<h1> <a href ="/urls">Back to main page</a>`);
  }
});


app.post('/urls/:id', (req, res) => {
  const user_id = req.session['user_id'];


  if (!user_id) {
    return res.status(400).send(`<h1>You must login first!<h1> <a href ="/login">Back to Login</a>`);
  }

  const shortURL = req.params.id;


  if (!urlDatabase[shortURL]) {
    return res.status(400).send(`<h1>This shortcode does not exist!<h1> <a href ="/urls">Back to main page.</a>`);
  }


  if (urlDatabase[shortURL].userID !== user_id) {
    return res.status(400).send(`<h1>This is not your shortcode!<h1> <a href ="/urls">Back to main page.</a>`);
  }

  const urlId = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[urlId].longURL = longURL;
  res.redirect('/urls');
});



app.post('/urls/:id/delete', (req, res) => {
  const user_id = req.session['user_id'];


  if (!user_id) {
    return res.status(400).send(`<h1>You must login first!<h1> <a href ="/login">Back to Login</a>`);
  }

  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    return res.status(400).send(`<h1>This shortcode does not exist!<h1> <a href ="/urls">Back to main page.</a>`);
  }


  if (urlDatabase[shortURL].userID !== user_id) {
    return res.status(400).send(`<h1>This is not your shortcode!<h1> <a href ="/urls">Back to main page.</a>`);
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});



app.get("/urls/new", (req, res) => {
  const user_id = req.session['user_id'];

  if (!user_id) {
    res.send(`<h1>Please login to perfom this action<h1> <a href ="/login">Login</a>`);
    return res.redirect('/login');
  }

  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});



app.get("/urls/:id", (req, res) => {
  const user_id = req.session['user_id'];


  if (!user_id) {
    return res.status(400).send(`<h1>You must login first!<h1> <a href ="/login">Back to Login</a>`);
  }

  const user = users[user_id];
  const urlShortCode = req.params.id;


  if (!urlDatabase[urlShortCode]) {
    return res.status(400).send(`<h1>This shortcode does not exist!<h1> <a href ="/urls">Back to main page.</a>`);
  }

  if (urlDatabase[urlShortCode].userID !== user_id) {
    return res.status(400).send(`<h1>This is not your shortcode!<h1> <a href ="/urls">Back to main page.</a>`);
  }

  const longURL = urlDatabase[urlShortCode].longURL;
  const templateVars = {
    id: urlShortCode,
    longURL,
    user
  };
  res.render("urls_show", templateVars);
});


//REGISTER

app.get("/register", (req,res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let templateVars = {
      status: 401,
      message: 'Email and/or password missing',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
    ('Email and/or password missing');
  } else if (getUserByEmail(email, users)) {
    let templateVars = {
      status: 409,
      message: 'This email has already been registered',
      user: users[req.session.user_id]
    }
    res.status(409);
    res.render("urls_error", templateVars);
  } else {
    const user_id = addUser(email, password, users);
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});
app.get("/login", (req, res) => {
  const user_id = req.session['user_id'];

  if (user_id) {
    return res.redirect('/urls');
  }

  const user = users[user_id];
  const templateVars = { user, urls: urlDatabase };
  res.render("urls_login", templateVars);
});


app.get("/urls", (req, res) => {
  const user_id = req.session['user_id'];

  if (!user_id) {
    return res.status(400).send(`<h1>You must login first!<h1> <a href ="/login">Back to Login</a>`);
  }

  let urlObj = urlsForUser(user_id, urlDatabase);
  const user = users[user_id];
  const templateVars = { user, urls: urlObj };
  res.render("urls_index", templateVars);
});


app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  
  if (!email || !password) {
    return res.status(400).send(`<h1>You must enter both email and password to login!<h1> <a href ="/login">Back to Login</a>`);
  }

  const user = getUserByEmail(email, users);

  
  if (!user) {
    return res.status(400).send(`<h1>You haven't registered this email!<h1> <a href ="/register">Back to Registration</a>`);
  }


  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send(`<h1>Email or password is incorrect!<h1> <a href ="/login">Back to Login</a>`);
  }

  const user_id = user.id;
  req.session.user_id = user_id;
  res.redirect('/urls');
});



app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});