const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());
const {
  models: { User, Note },
} = require('./db');
const path = require('path');

const requireToken = async (req, res, next) =>{
  try {
    const token = req.headers.authorization;
    const user = await User.byToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// app.use(requireToken);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res, next) => {
  // req.body = { username: "lucy", password: "lucy_pw" }
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/notes', requireToken, async (req, res, next) => {
  try {
    console.log("!!!!!!!!!!!!!!!", req.user);
    //        res.send(await User.byToken(req.headers.authorization));
  //  const token = req.headers.authorization;
   // const unscrambleToken = jwt.verify(token, 'brogle');
   // console.log('token', token);
    //console.log('unscrambleToken', unscrambleToken);

    const notes = await Note.findAll({
      where: { userId: req.user.dataValues.id},
    });
    //const notes = await User.findAll({where: {id: req.params.id}, include: {model: Note}})

    res.send(notes);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/auth', requireToken, async (req, res, next) => {
  try {
    res.send(await User.byToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});


module.exports = app;
