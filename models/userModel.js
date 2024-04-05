const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLength: 6
    },
   
    date:{
        type: Date,
        default: Date.now()
    }
})

userSchema.pre("save", async function(next){
    let password = this.password
    const salt = 11
    const hashedPassword = await bcrypt.hash(password, salt)
    this.password = hashedPassword
    next()
})

module.exports = new mongoose.model("User", userSchema)