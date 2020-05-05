const express = require('express');
const cookie = require('cookie');
const jwt = require('./jwt');

const router = express.Router();

router.get('/home', authenticateToken, (req, res) => { // 
//  const user = req.user;
//  console.log(user);
  res.render('home.ejs'); // , { user: user }
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

module.exports = router;
