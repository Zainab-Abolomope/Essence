const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    colors:[
        {type: String},
    ],
    sizes:[
        {type: String},
    ],
    price:{
        type: Number,
        default: 0
    },
    images:[
        {type: String},
    ], 
    imageOne:{
        type: String,
    }, 
    imageTwo:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

module.exports = new mongoose.model("Product", productSchema)