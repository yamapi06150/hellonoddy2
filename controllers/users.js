var dbConnection ;

var ObjectID = require('mongodb').ObjectID;

var User = require('../models/User.model');////

exports.setDBConnectionFromApp = function ( app ){
    dbConnection = app.get('dbConnection');
}

exports.findAll = function ( req , res ){
    var collection = dbConnection.collection('users');

    var items = collection.find( {} , function ( err , docsCursor){ //returnItem
        res.type('application/json');

        if(err){
            res.status(500);
            res.send( { success : false , msg : 'database error..' } );
            return;
        }

        var itemList = [] ;
        docsCursor.each( function( err , item ){

            if( item != null ){
                var newItem = {};
                newItem.name = item.name;
                newItem.email = item.email;
                //newItem.password = item.password;
                newItem.lon = item.location[0];
                newItem.lat = item.location[1];

                itemList.push(newItem);
            }else{
                res.status(200);
                res.json(itemList);
            }
        });
    });
}

exports.findById = function ( req , res ){
    var collection = dbConnection.collection('users');
    res.type('application/json');

    var objectId = req.params.id;
    try{
        objectId = ObjectID(objectId);
    }catch (e){
        res.status(500);
        res.send( { success:false , msg:'invalid object id..'});
        return;
    }

    var items = collection.findOne( { _id : objectId} ,function( err , returnItem ){
        if( returnItem != null ){
            var newItem = {};
            newItem.name = returnItem.name;
            newItem.email = returnItem.email;
            //newItem.password = item.password;
            newItem.lon = returnItem.location[0];
            newItem.lat = returnItem.location[1];

            res.status(200);
            res.json(newItem);
            //res.send(newItem);////for testing only
            //res.json和res.send，在Mocha中這兩個裡面，每次只能叫1個，因都會以res.end()回傳
            //1次回傳2個會再Mocha Testing中出錯...
        }else{
            res.status(400);
            res.send({ success:false , msg:'item not found' });
        }

    });
}

exports.findNearMe = function ( req , res ){
    var collection = dbConnection.collection('users');
    res.type('application/json');

    var lon = req.params.lon;
    var lat = req.params.lat;

    collection.find( { location : { $near : [parseFloat(lon),parseFloat(lat)] }} , function( err , docsCursor ){
        res.type('application/json');

        if(err){
            res.status(500);
            res.send( { success : false , msg : 'database error..' } );
            return;
        }

        var itemList = [] ;
        docsCursor.each( function( err , item ){

            if( item != null ){
                var newItem = {};
                newItem.name = item.name;
                newItem.email = item.email;
                //newItem.password = item.password;
                newItem.lon = item.location[0];
                newItem.lat = item.location[1];

                itemList.push(newItem);
            }else{
                res.status(200);
                res.json(itemList);
            }
        });
    });

}

exports.add = function ( req , res ){
    res.type('application/json');

    User.create( req.body , function (err , returnItem ){
       if(err){
           res.status(500);
           res.send({ success : false , msg : 'error saving user' } );
       } else {
           console.log(returnItem);
           res.status(201);
           res.json(returnItem);
       }
    });

}