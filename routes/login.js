const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/blog';
const dbhandle = require('../mongo');

router.post('/', (req, res) => {
  let param = req.body;
  let whereStr = {"name": param.name};
  console.log(param);
  if(req.cookies.name){
      res.header("Access-Control-Allow-Credentials","true");
      res.sendStatus(200);
  }
  else if(!param.name) {
    console.log(2);
    res.sendStatus(400);
  }
  else {
    console.log(3);
    let date = new Date();
    mongo.connect(DB_CONN_STR, (err, db) => {
      dbhandle.findData(db, (result) => {
        if(result[0].password !== param.password) {
          res.sendStatus(403);
        }
        else {
          res.cookie("name", param.name, {httpOnly: false, maxAge: 7*24*3600*1000, expires: new Date(date.getTime()+7*24*3600*1000)});
          res.sendStatus(200);
        }
      }, whereStr, "user")
    });
  } 
});

module.exports = router;