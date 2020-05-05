const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const db = require('./db');
const jwt = require('./jwt');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post('/login', [
  check('email')
    .isEmail()
    .withMessage("Email is invalid"),
  check('password')
    .isLength({ min: 4 })
    .withMessage("Password must be longer than 3 characters.")
  ], async (req, res) => {
  function RJO (status, message) {
    this.status = status;
    this.message = message;
  }
  const errorResult = validationResult(req);
  if(!errorResult.isEmpty()) {
    console.log(errorResult.errors);
    var error_message = "";
    for(var x=0; x<errorResult.errors.length; x++) {
      error_message += "- " + errorResult.errors[x].msg;
    }
    var error_object = new RJO('error', error_message);
    error_object = JSON.stringify(error_object);
    return res.send(error_object);
  }
  // Authenticate
  const user_email = req.body.email;
  console.log(req.body.password);

  const user = { email: user_email };
  
  db.selectAll("SELECT * FROM users WHERE email = ?",
    [
      user_email
    ]
  )
    .then(async function(result) {
      if(result[0] != undefined) {
        var matchPassword = await bcrypt.compare(req.body.password, 
        result[0].password)
        if(matchPassword) {
          var response_object = {
            status: 'OK',
            message: result[0].email
          };
            response_object = JSON.stringify(response_object);
            
            const user = { 
              name: result[0].name,
              email: result[0].email
            };
            const accessToken = jwt.generateAccessToken(user);
            const refreshToken = jwt.generateRefreshToken(user);
            db.insertOne("INSERT INTO tokens (ref_token) VALUES (?)", 
              [
                refreshToken
              ]
            )
              .then(result => {
                res.cookie('AJWT', accessToken);
                res.cookie('RJWT', refreshToken);
                return res.send(response_object);  
              })
              .catch(err => {
                console.log(err);
                var error_object = new RJO('error', "Server error");
                return res.send(error_object);
              })
        } else {
          var error_object = new RJO('error', 
          "Username/Password is not correct.");
          error_object = JSON.stringify(error_object);
          return res.send(error_object);
        }
      } else {
        var error_object = new RJO('error', 
        "Username/Password is not correct.");
        error_object = JSON.stringify(error_object);
        return res.send(error_object);
      }
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
});

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.post('/register', [
  check('name')
    .isAlpha()
    .withMessage("Name must only be made of words.")
    .isLength({min: 3})
    .withMessage("Name must be longer than 2 characters."),
  check('email')
    .isEmail()
    .withMessage("Email is invalid"),
  check('password')
    .isLength({ min: 4 })
    .withMessage("Password must be longer than 3 characters.")
  ], async (req, res) => {
  function RJO (status, message) {
    this.status = status;
    this.message = message;
  }
  const errorResult = validationResult(req);
  if(!errorResult.isEmpty()) {
    console.log(errorResult.errors);
    var error_message = "";
    for(var x=0; x<errorResult.errors.length; x++) {
      error_message += "- " + errorResult.errors[x].msg;
    }
    var error_object = new RJO('error', error_message);
    error_object = JSON.stringify(error_object);
    return res.send(error_object);
  }
  // Authenticate
  const {name, email, password } = req.body;
  var hashedPassword = await bcrypt.hash(password, 10);
    
  db.insertOne("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [
      name,
      email,
      hashedPassword
    ]
  )
    .then(result => {
      console.log(result) 
      var response_object = {
        status: 'OK',
        message: "User is registered successfully."
      };
      response_object = JSON.stringify(response_object);
      return res.send(response_object);
    })
    .catch(err => {
      var error_object = new RJO('error', 
      "Server Error: " + err);
      error_object = JSON.stringify(error_object);
      return res.send(error_object);
    });
});

module.exports = router;
