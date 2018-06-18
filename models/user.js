var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   bookings: [{
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
            },
        price: Number,
        room: Number
   }],
   drafts: [{
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
            },
        price: Number,
        room: Number
   }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);