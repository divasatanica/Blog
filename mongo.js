function insertData(db, callback, data, collections){
	var collection = db.collection(collections);
	collection.insert(data, function(err, result){
		if(err){
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}

function findData(db, callback, wherestr, collections){
	var collection = db.collection(collections);
	collection.find(wherestr).toArray(function(err, result){
		if(err){
			console.log('Error:' + err);
			return ;
		}
		callback(result);
	});
}

function findDataWithOffset(db, callback, sortstr, collections, offset){
  var collection = db.collection(collections);
  collection.find().sort(sortstr).skip(offset).limit(5).toArray(function(err, result){
    if(err){
      console.log('Error:' + err);
      return ;
    }
    callback(result);
  });
}

function updateData(db, callback, collections) {   
    var collection = db.collection(collections);
    var whereStr = {"name":'Coma'};
    var updateStr = {$set: { "message" : "i love you" }};
    collection.update(whereStr, updateStr, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}

function delData(db, callback, collections) {   
  var collection = db.collection(collections);
  var whereStr = {"name":'Coma'};
  collection.remove(whereStr, function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

module.exports.insertData = insertData;
module.exports.findData = findData;
module.exports.findDataWithOffset = findDataWithOffset;
module.exports.updateData = updateData;
module.exports.delData = delData;