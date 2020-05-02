const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const db = require('./db');
const jwt = require('./jwt');

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post('/login', [
  check('email')
    .isEmail()
    .withMessage("Email is invalid"),
  check('password')
    .isLength({ min: 5 })
    .withMessage("Password must be longer than 4 characters.")
  ], (req, res) => {
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
  const user = { email: user_email };

  db.selectAll("SELECT * FROM users WHERE email = ?", [user_email])
    .then(result => {
      if(result != undefined) {
        var response_object = {
          status: 'OK',
          message: result[0]
        };
        response_object = JSON.stringify(response_object);
        const user = { email: response_object.email };
        const accessToken = jwt.makeAccessToken(user);
        res.cookie('AJWT', accessToken);
        return res.send(response_object);
      } else {
        var error_object = new RJO('error', "Username is not correct.");
        error_object = JSON.stringify(error_object);
        return res.send(error_object);
      }
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
});

module.exports = router;
