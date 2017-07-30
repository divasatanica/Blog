const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/blog';
const dbhandle = require('../mongo.js');
const objectid = require('objectid');
const path = require('path');
const mark = require('marked');
const multi = require('multiparty');
const fs = require('fs');

router.post('/new', function(req, res, next) {
	let data = req.body;
	var dbObject = {
		"header":'',
		"paras":[],
		"timeStamp":'',
		"marked": "",
		"clock":""
	};
	var date = new Date(); 
	if(!data.header){
		return false;
	}
	dbObject.header = data.header;
	dbObject.marked = mark(data.passage2mark);
	dbObject.clock = data.clock; 
	dbObject.timeStamp = String(date.getFullYear())  + '0' + String(date.getMonth() + 1) + (date.getDate()>9?'':'0') + String(date.getDate()) + ((req.body.count >= 10) ? '0' + String(req.body.count) : '00' + String(req.body.count));
	mongo.connect(DB_CONN_STR, function(err, db){
		dbhandle.insertData(db, function(result){
			db.close();
			res.header("Access-Control-Allow-Origin", "*");
			res.send(JSON.stringify({"message":"文章已发布！"}));
		}, dbObject, 'article');
	});
});

router.get('/data/:id', function(req, res, next) {
	var where = {"_id":objectid(req.params.id)};
	res.header("Access-Control-Allow-Origin", "*"); 
	mongo.connect(DB_CONN_STR, function(err, db){
		dbhandle.findData(db, function(result){
			if(result.length == 0){
				res.status(404).send(JSON.stringify({"0":"Not found!"}));
				return ;
			}
			var response = {};
			for(var i in result){
				response[i] = result[i];
				response[i].link = "http://comacc.top/display/" + response[i]._id;
			}
			res.send(response);
			db.close();
		}, where, 'article');
	});
});

router.get('/display/:id', function(req, res){
	const where = {"_id":objectid(req.params.id)};
	res.header("Access-Control-Allow-Origin", "*"); 
	mongo.connect(DB_CONN_STR, function(err, db){
		dbhandle.findData(db, function(result){
			if(result.length == 0){
				res.status(404).send(JSON.stringify({"0":"Not found!"}));
				return ;
			}
			let response = {};
			result = result[0];
			for(let i in result){
				response[i] = result[i];
			}
			response.timeStamp = ((timeStamp) => {
				return `${timeStamp.slice(0, 4)}-${timeStamp.slice(4, 6)}-${timeStamp.slice(6, 8)}`;
			})(result.timeStamp);
			res.render('article', response);
			db.close();
		}, where, 'article');
	});
});

router.get('/newest', function(req, res, next){
	var sortstr = {"timeStamp":-1};
	var offsetNo = Number(req.query.offset);
	res.header("Access-Control-Allow-Origin", "*"); 
	mongo.connect(DB_CONN_STR, function(err, db){
		dbhandle.findDataWithOffset(db, function(result){
			if(result.length == 0){
				res.status(404).send(JSON.stringify("{'0':'Not found!'}"));
				return ;
			}
			var response = {};
			for(var i in result){
				response[i] = result[i];
				response[i].link = "http://comacc.top/display/" + response[i]._id;
			}

			res.send(response);
			db.close();
		}, sortstr, 'article', offsetNo);
	});
});

module.exports = router;