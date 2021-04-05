const jwt = require('jsonwebtoken')
const User = require('../model/User')

const  auth = async(req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ',"")
        const decoded = jwt.verify(token,'BMT')
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            return new Error()
        }
        req.token = token
        req.user = user
    next()
    }
    catch(e){
        
        res.status(503).send(e)
    }
}

module.exports = auth