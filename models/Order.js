const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    email: { type:String, required: true },
    orders:[{ 
        orderId:{type:String , required: true},
        purchaseDate:{type:String, required: true}, 
        products:[{bookId: { type:String, required: true},price:{type:Number, required: true} },],
        price:{type:Number, required: true},
        isPaid:{type:Boolean, default:false}    
    }],
}, { timestamps: true });

module.exports = mongoose.model('Order', order);