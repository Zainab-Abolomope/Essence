const jwt = require("jsonwebtoken")

function verify(req, res, next){
const token = req.cookies.essence_token

    if(!token){
        return res.redirect("/login")
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
        if(err){
        return res.redirect("/login")
        }

        req.user = decoded
        next();
    })
}

function checkUser(req, res, next){
    const token = req.cookies.essence_token
    const decoded = jwt.decode(token, process.env.JWT_KEY)
    req.user = decoded
    next();
}



module.exports = {verify, checkUser}