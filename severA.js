require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routes/api-router');

const app = express();

/* VIEW ENGINE */
app.set('view-engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
/* ROUTERS */
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server A is up and running on PORT: ${process.env.PORT}`);
});
