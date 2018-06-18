var db = require('../models/hotel');
var User = require('../models/user');

exports.getHotels = function(req, res){
    db.find()
    .then(function(hotels){
        res.json(hotels);
    })
    .catch(function(err){
        res.send(err);
    })
}

exports.createHotel = function(req, res){
      db.create(req.body.hotel)
      .then(function(newTodo){
          res.status(201).json(newTodo);
      })
      .catch(function(err){
          res.send(err);
      })
}

exports.getHotelDetails = function(req, res){
      db.findById(req.params.id).populate('visitors').populate('draft').populate('done').exec(function(err, foundHotel){
        if(err){
            console.log(err)
        } else{
            foundHotel.visitors.push(req.user._id);
            foundHotel.save();
            db.find({}, function(err, allHotels){
                if(err){
                    res.redirect('/')
                }else{
                    var location = sameLocation(allHotels, foundHotel);
                    var price = samePrice(allHotels, foundHotel);
                    res.render("hotel/hotelDetails", {hotel: foundHotel, location: location, price: price});
                }
            })
        }
    })
}

function sameLocation(arr, arr2){
    var array = [];
        
    for(let i=0; i <arr.length; i++){
        if(arr[i].name == arr2.name){
            
        }
        else if(arr[i].location == arr2.location){
            array.push(arr[i]);
        }
    }
    return array;
}

function samePrice(arr, arr2){
    var array = [];
        
    for(let i=0; i <arr.length; i++){
        if(arr[i].name == arr2.name){
            
        }
        else if(arr[i].price <= arr2.price + 1000 && arr[i].price >= arr2.price - 1000){
            array.push(arr[i]);
        }
    }
    return array;
}



exports.draftHotel = function(req, res){
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err)
        }
        else{
        db.findById(req.params.id, function(err, foundHotel){
         if(err){
            console.log(err)
        } else{
            let userId = foundHotel.draft.indexOf(req.user._id);
            if(userId > -1){
                res.redirect('/details');
            } else{
                foundHotel.draft.push(req.user._id);
                foundHotel.save();
                
                var name = foundHotel.name,
                    price = foundHotel.price,
                    rooms = req.body.roomNumber,
                    id = foundHotel._id;
                var obj = {name: name, price: price*rooms ,room: rooms ,id: id}
                user.drafts.push(obj);
                user.save();
                console.log(req.user)
                
                res.redirect('/details')
            }
        }
    })
        }
    })
    
}


// exports.confirmHotel = function(req, res){
//     db.findById(req.params.id, function(err, foundHotel){
//         if(err){
//             console.log(err);
//         }else{
//             let userId = foundHotel.draft.indexOf(req.user._id);
//             if(userId > -1){
//                 foundHotel.draft.splice(userId, 1);
//                 foundHotel.done.push(req.user._id);
//                 foundHotel.save();
//                 res.redirect('/')
//             }else{
//                 foundHotel.done.push(req.user._id);
//                 foundHotel.save();
//                 res.redirect('/')
//             }
//         }
//     })
// }

exports.confirmHotel = function(req, res){
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err)
        }else{
            db.findById(req.params.id, function(err, foundHotel){
        if(err){
            console.log(err);
        }else{
            console.log(req.user)
            var idx = findIndexObj(foundHotel._id, user.drafts);
            console.log(idx)
            let userId = foundHotel.draft.indexOf(req.user._id);
            if(userId > -1){
                foundHotel.draft.splice(userId, 1);
                foundHotel.done.push(req.user._id);
                foundHotel.save();
                res.redirect('/')
            }else{
                foundHotel.done.push(req.user._id);
                foundHotel.save();
                res.redirect('/')
            }
        }
    })
        }
    })
    
}
function findIndexObj(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].id == nameKey) {
            return i;
        }
    }
}



module.exports = exports;
