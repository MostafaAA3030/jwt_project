const express = require('express');
const cookie = require('cookie');
const jwt = require('../lib/jwt');

const router = express.Router();

router.get('/home', authenticateToken, (req, res) => { // 
  const user = req.user;
  var user_obj = {
    name: user.name,
    email: user.email
  };
  res.render('home.ejs', { user: user_obj });
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

router.get('/logout', (req, res) => {
  res.clearCookie('AJWT');
  res.clearCookie('RJWT');
  res.redirect('/api/login');
})
module.exports = router;
