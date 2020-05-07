const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('./routes/jwt');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', authenticateToken, (req, res) => {
  res.send("THIS IS MY SECOND HOME PAGE");
});

function authenticateToken (req, res, next) {
  console.log("From: authenticateToken middleware: ");
  const authHeader = req.headers['authorization'];
  const hToken = authHeader && authHeader.split(' ')[1];
  
  console.log("Header Token:");
  console.log(hToken);

  if(!hToken) {
    var cookies = req.cookies;
    var token = cookies.AJWT;
    
    console.log("Cookie token:");
    console.log(token);
  } else {
    var token = hToken;
  }
  if(token == null) return res.send("Forbidden Page.");
    
  jwt.verifyAccessToken(token, (err, user) => {
    if(err) {
      console.log(err);
      return res.send("Forbidden");
    }
    console.log("User in authenticateToken middleware: ");
    console.log(user);
    req.user = user;
    next();
  });
}

app.listen(4000, () => {
  console.log("Server is on port 4000 running");
});
