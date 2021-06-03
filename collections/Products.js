const mongoose = require('mongoose');
const Shema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const mongooseLeanId = require('mongoose-lean-id');

const schema = new mongoose.Schema(
    {
        _id: Number,
        name: {type: String, default: "No Name"},
        price: {type : Number, default: 10},
        description: {type : String, default: "No description"},
        img: String,
    },
    {
        //toObject  //toJSON
        toObject: {
            transform: function(doc, ret) {
                ret.id = ret._id;
                return ret;
            }
        },
        toJSON: {
            transform: function(doc, ret) {
                ret.id = ret._id;
                return ret;
            }
        }
    },
);
schema.plugin(autoIncrement.plugin, 'Product');
schema.plugin(mongooseLeanId);

var Products;
function make(connection){
    if(Products) return Products;
    Products = connection.model('Product', schema);
    return Products;
}

module.exports = make;